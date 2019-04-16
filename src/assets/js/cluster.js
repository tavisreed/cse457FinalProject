class Cluster {
  constructor(_parent, _data) {
    this.parent = _parent;
    this.data = _data;
    this.init();
  }

  init() {
    let self = this;

    // initialize plot
    self.margin = {top: 30, right: 30, bottom: 30, left: 60};
    self.width = window.innerWidth - self.margin.left - self.margin.right;
    self.height = window.innerHeight- self.margin.top - self.margin.bottom;
    self.padding = 1.5, // separation between same-color nodes
    self.clusterPadding = 6, // separation between different-color nodes
    self.maxRadius = 15;
    
    var centerScale = d3.scalePoint().padding(1).range([0, self.width]);
    var colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);
    var forceStrength = 0.05;
    self.radiusScale = d3.scalePow()
    .exponent(0.5)
    .range([0,20])
    .domain([0,120000]);

    
    
    // update message, data done loading
    document.querySelector('#home-message').style.display = 'none';


    // svg setup
    let svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom);
        showClusterLegend();    
    let g = svg.append("g").attr("id","clusterG").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
     


      var simulation = d3.forceSimulation()
            .force("collide",d3.forceCollide( function(d){
              	return d.r + 8 }).iterations(16) 
            )
            .force("charge", d3.forceManyBody())
            .force("y", d3.forceY().y(self.height / 2))
            .force("x", d3.forceX().x(self.width / 2))
    
    
      
    self.data[2018].forEach(function(d){
        
      d.r = self.radiusScale(d.graduate_enroll+d.undergrad_enroll);
        d.x = self.width / 2;
        d.y = self.height / 2;
      })
      
      var nodes = self.data[2018];
      
      
      
      var circles = g.selectAll("circle")
      	.data(nodes);
      
      var circlesEnter = circles.enter().append("circle")
      	.attr("r", function(d, i){ return d.r; })
        .attr("cx", function(d, i){ return 175 + 25 * i + 2 * i ** 2; })
				.attr("cy", function(d, i){ return 250; })
      	.style("fill", "#ADD8E6")
      
        .style("pointer-events", "all")
      	.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
                
        circlesEnter.append('svg:title')
        .text(function(d) { return d.name });

        //Added ID to use in searching
        circlesEnter.attr("id",function(d){
          var name=d.name.split(' ').join('');
          name=name.split('.').join('');
          name=name.split('-').join('');
          name=name.split(',').join('');
          name=name.split("'").join('');

          return name})


        circlesEnter.on("click", function(d){
               $("#selection").val(d.index).trigger('change');
               $('#nav-profile-tab').trigger('click');
             })
      
      
      circles = circles.merge(circlesEnter);
      
      
             
      function ticked() {
        //console.log("tick")
        //console.log(data.map(function(d){ return d.x; }));
        circles
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; });
      }   

      simulation
            .nodes(nodes)
            .on("tick", ticked);
      

     
      //selects selection box and assigns onchange value, then calls splitBubbles on change
      d3.select("#home_selection").on("change", function(){
        var value = $("#home_selection option:selected").val();
        splitBubbles(value); 
      });

      // d3.select("#search_btn").on("click", function(){
      //   findNode($("#search").val())
      // });
      function dragstarted(d,i) {
        //console.log("dragstarted " + i)
        if (!d3.event.active) simulation.alpha(1).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d,i) {
        //console.log("dragged " + i)
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d,i) {
        //console.log("dragended " + i)
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
       
       
       
      } 
      
      function groupBubbles() {
        //hideTitles();

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(w / 2));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
      }
      
      function splitBubbles(byVar) {
        
        centerScale.domain(nodes.map(function(d){ return d[byVar]; }));
        
        colorScale.domain(nodes.map(function(d){return d[byVar];}));
        
        circles.style("fill", function(d){
          if(typeof d[byVar] === "undefined"){
            return "#ADD8E6";
          }
          return colorScale(d[byVar]);
        });

        // circles = circles.merge(circlesEnter);
      
        // if(byVar == "all"){
        //   hideTitles()
        // } else {
	      //   showTitles(byVar, centerScale);
        // }
        
        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(function(d){ 
        	return centerScale(d[byVar]);
        }));


        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(2).restart();
      }
      
      
      function showClusterLegend(){
        var gDiv =  svg.append("g");
        var gHeight = self.height/3;
        gDiv.attr("transform", "translate("+self.width/1.25+","+self.height/3+")");
        gDiv.append("g").attr("transform", "translate(75," + (gHeight*0.25)+")").append("text").text("Total Enrollment")
        gDiv.append("circle").attr("r", self.radiusScale(120000)).style("fill","grey").attr("cy",gHeight*0.4).attr("cx", 100);
        gDiv.append("g").attr("transform", "translate(125," + (gHeight*0.4)+")").append("text").text("120000")
        gDiv.append("circle").attr("r", self.radiusScale(67500)).style("fill","grey").attr("cy",(gHeight*0.4)+40).attr("cx", 100);
        gDiv.append("g").attr("transform", "translate(125," + ((gHeight*0.4)+40)+")").append("text").text("67500")
        gDiv.append("circle").attr("r", self.radiusScale(30000)).style("fill","grey").attr("cy",(gHeight*0.4)+70).attr("cx", 100);
        gDiv.append("g").attr("transform", "translate(125," + ((gHeight*0.4)+70)+")").append("text").text("30000")
        gDiv.append("circle").attr("r", self.radiusScale(7500)).style("fill","grey").attr("cy",(gHeight*0.4)+90).attr("cx", 100);
        gDiv.append("g").attr("transform", "translate(125," + ((gHeight*0.4)+90)+")").append("text").text("7500")
      }

      // function findNode(query){
      //   circles
      //   .style("stroke" ,"black")
      //   .style("stroke-width", function(d){
      //     if(d.name == query){
      //       console.log(d);
      //       return d.r/3;
      //     }
      //     return "0"
      //   });
      // }
      // function hideTitles() {
      //   svg.selectAll('.title').remove();
      // }

      // function showTitles(byVar, scale) {
      //   // Another way to do this would be to create
      //   // the year texts once and then just hide them.
      //  	var titles = svg.selectAll('.title')
      //     .data(scale.domain());
        
      //   titles.enter().append('text')
      //     	.attr('class', 'title')
      //   	.merge(titles)
      //       .attr('x', function (d) { return scale(d); })
      //       .attr('y', 40)
      //       .attr('text-anchor', 'middle')
      //       .text(function (d) { return byVar + ' ' + d; });
        
      //   titles.exit().remove() 
      // }
    
    
    // let parse_time = d3.timeParse("%Y");
    // let years = create_years(1999,2018);
    
    // let year_data = years.map(function(d) {
    //   return {
    //     'date': parse_time(d),
    //     'value': self.data[d]
    //   }
    // });
    //   //Create event handler
    // var MyEventHandler = {};

    // //Create Year chart for brushing
    // var dates=[];
    // for (let i=0; i<year_data.length; i++) {
    //   dates.push(year_data[i].date);
    // }
    // let year_chart= new YearChart('Year_chart_home', dates, MyEventHandler);

    // //Bind event handler
    // $(MyEventHandler).bind("selectionChanged", function(event, selectionStart, selectionEnd){
     
    
    // });
   
    
 
  //   let m = 10; // number of distinct clusters

  //   var color = d3.scaleSequential(d3.interpolateRainbow)
  //       .domain(d3.range(m));

  //   // The largest node for each cluster.
  //   var clusters = new Array(m);

  //   var force = d3.forceSimulation()
  //     // keep entire simulation balanced around screen center
  //     .force('center', d3.forceCenter(self.width/2, self.height/2));

  //     // cluster by section
  //     // .force('cluster', cluster()
  //     //   .strength(0.2))

  //     // apply collision with padding
      
      
      

  //   var node = g.selectAll("circle");
    
  //   update(getNodes(2018),2018);
  //   // d3.interval(function(){
  //   //   var lastDigit = Math.floor(Math.random() * 9);
  //   //   var nodes = getNodes(('201' + lastDigit));
  //   
  //   //   update(nodes,("201"+lastDigit))

  //   // }, 10000);


  //   for(var i = 1999; i<2019; ++i){
  //     var b = document.getElementById("home").appendChild(document.createElement("button"));
  //     b.innerHTML = i;
  //     b.setAttribute("id", "yearButton");
  //     b.setAttribute("value", i);
      
  //   }
  //   // var nodes = getNodes(2018);
    
  //   d3.selectAll("#yearButton").on("click", function(){
  //     update(getNodes(d3.select(this).text()),d3.select(this).text());
  //   })
  //   //function update(data){
  //   function update(sedon,year){
    
  //   var s = d3.transition()
  //         .duration(750);

  //     // Apply the general update pattern to the nodes.
  //     node = node.data(sedon);

  //     node.exit()
  //       .transition(s)
  //         .attr("r", 1e-6)
  //         .remove();

  //     node
  //         .transition(s)
  //         .style("fill", function(d) { return color(d.cluster/10); })
  //         .attr("r", function(d){ return d.radius;});

  //     node = node.enter().append("circle")
  //     .style("fill", function(d) { return color(d.cluster/10); })
  //     .attr("r", function(d){ return d.radius; })
  //     .merge(node);

  //   node.on("click", function(d){
    
  //     $("#selection").val(d.data.index).trigger('change');
  //     $('#nav-profile-tab').trigger('click');
  //   })

  //   node.append('svg:title')
  //     .text(function(d) { return d.data.name; })

  //   force.nodes(sedon)
  //   .force('collide', d3.forceCollide(d => d.radius + self.padding).strength(1))
  //   .on('tick', layoutTick);
  //   //ramp up collision strength to provide smooth transition
  //   // var transitionTime = 3000;
  //   // var t = d3.timer(function (elapsed) {
  //   //   var dt = elapsed / transitionTime;
  //   //   force.force('collide').strength(Math.pow(dt, 2) * 0.7);
  //   //   if (dt >= 1.0) t.stop();
  //   // });
  // }

  // function getNodes(year){
  //   return self.data[year].map(function(e) {
  //     var i = Math.floor(Math.random() * m),
  //         r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * self.maxRadius,
  //         pub = 0;

  //     if (e.type != 'none') {
  //       pub = e.type == 'PUBLIC' ? 0 : 1;
  //     }
  //     i = pub;
  //     //console.log(e.undergrad_enroll != NaN ? e.undergrad_enroll/10000 : 1);

  //     let d = {
  //           data: e,
  //           cluster: i,
  //           radius: isNaN(e.undergrad_enroll) ? 1 : e.undergrad_enroll/3000,
  //           x: Math.cos(i / m * 2 * Math.PI) * 100 + self.width / 2 + Math.random(),
  //           y: Math.sin(i / m * 2 * Math.PI) * 100 + self.height / 2 + Math.random()
  //         };
  //     if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  //     return d;
  //   });
  // }
  
  //   function layoutTick(e) {
  //     node
  //         .attr("cx", function(d) { return d.x; })
  //         .attr("cy", function(d) { return d.y; })
  //         .attr("r", function(d) { return d.radius; });
  //   }

  //   // Move d to be adjacent to the cluster node.
  //   // from: https://bl.ocks.org/mbostock/7881887
  //   function cluster() {
  //     var nodes,
  //       strength = 0.1;

  //     function force(alpha) {
  //       // scale + curve alpha value
  //       alpha *= strength * alpha;

  //       nodes.forEach(function(d) {
  //         var cluster = clusters[d.cluster];
  //         if (cluster === d) return;
          
  //         let x = d.x - cluster.x,
  //           y = d.y - cluster.y,
  //           l = Math.sqrt(x * x + y * y),
  //           r = d.radius + cluster.radius;

  //         if (l != r) {
  //           l = (l - r) / l * alpha;
  //           d.x -= x *= l;
  //           d.y -= y *= l;
  //           cluster.x += x;
  //           cluster.y += y;
  //         }
  //       });
  //     }

  //     force.initialize = function (_) {
  //       nodes = _;
  //     }

  //     force.strength = _ => {
  //       strength = _ == null ? strength : _;
  //       return force;
  //     };

  //     return force;
  //   }
  }
}