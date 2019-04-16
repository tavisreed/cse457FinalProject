class Cluster {
  constructor(_parent, _data) {
    this.parent = _parent;
    this.data = _data;
    this.init();
  }

  init() {
    let self = this;

    // initialize plot
    self.margin = {top: 30, right: 30, bottom: 30, left: 30};
    self.width = window.innerWidth/1 - self.margin.left - self.margin.right;
    self.height = window.innerHeight/1.5 - self.margin.top - self.margin.bottom;
    self.padding = 1.5, // separation between same-color nodes
    self.clusterPadding = 6, // separation between different-color nodes
    self.maxRadius = 12;

    // update message, data done loading
    document.querySelector('#home-message').style.display = 'none';

    // svg setup
    let svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom),
      g = svg.append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    let m = 10; // number of distinct clusters

    var color = d3.scaleSequential(d3.interpolateRainbow)
        .domain(d3.range(m));

    // The largest node for each cluster.
    var clusters = new Array(m);

    var force = d3.forceSimulation()
      // keep entire simulation balanced around screen center
      .force('center', d3.forceCenter(self.width/2, self.height/2));

      // cluster by section
      // .force('cluster', cluster()
      //   .strength(0.2))

      // apply collision with padding
      
      
      

    var node = g.selectAll("circle");
    
    update(getNodes(2018),2018);
    // d3.interval(function(){
    //   var lastDigit = Math.floor(Math.random() * 9);
    //   var nodes = getNodes(('201' + lastDigit));
    //  console.log("sense at all")
    //   update(nodes,("201"+lastDigit))

    // }, 10000);


    for(var i = 1999; i<2019; ++i){
      var b = document.getElementById("home").appendChild(document.createElement("button"));
      b.innerHTML = i;
      b.setAttribute("id", "yearButton");
      b.setAttribute("value", i);
      
    }
    // var nodes = getNodes(2018);
    
    d3.selectAll("#yearButton").on("click", function(){
      update(getNodes(d3.select(this).text()),d3.select(this).text());
    })
    //function update(data){
    function update(sedon,year){
    
    var s = d3.transition()
          .duration(750);

      // Apply the general update pattern to the nodes.
      node = node.data(sedon);

      node.exit()
        .transition(s)
          .attr("r", 1e-6)
          .remove();

      node
          .transition(s)
          .style("fill", function(d) { return color(d.cluster/10); })
          .attr("r", function(d){ return d.radius;});

      node = node.enter().append("circle")
      .style("fill", function(d) { return color(d.cluster/10); })
      .attr("r", function(d){ return d.radius; })
      .merge(node);

    node.on("click", function(d){
    
      $("#selection").val(d.data.index).trigger('change');
      $('#nav-profile-tab').trigger('click');
    })

    node.append('svg:title')
      .text(function(d) { return d.data.name; })

    force.nodes(sedon)
    .force('collide', d3.forceCollide(d => d.radius + self.padding).strength(1))
    .on('tick', layoutTick);
    //ramp up collision strength to provide smooth transition
    var transitionTime = 3000;
    var t = d3.timer(function (elapsed) {
      var dt = elapsed / transitionTime;
      force.force('collide').strength(Math.pow(dt, 2) * 0.7);
      if (dt >= 1.0) t.stop();
    });
  }

  function getNodes(year){
    return self.data[year].map(function(e) {
      var i = Math.floor(Math.random() * m),
          r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * self.maxRadius,
          pub = 0;

      if (e.type != 'none') {
        pub = e.type == 'PUBLIC' ? 0 : 1;
      }
      i = pub;
      //console.log(e.undergrad_enroll != NaN ? e.undergrad_enroll/10000 : 1);

      let d = {
            data: e,
            cluster: i,
            radius: isNaN(e.undergrad_enroll) ? 1 : e.undergrad_enroll/3000,
            x: Math.cos(i / m * 2 * Math.PI) * 100 + self.width / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 100 + self.height / 2 + Math.random()
          };
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    });
  }
  
    function layoutTick(e) {
      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return d.radius; });
    }

    // Move d to be adjacent to the cluster node.
    // from: https://bl.ocks.org/mbostock/7881887
    function cluster() {
      var nodes,
        strength = 0.1;

      function force(alpha) {
        // scale + curve alpha value
        alpha *= strength * alpha;

        nodes.forEach(function(d) {
          var cluster = clusters[d.cluster];
          if (cluster === d) return;
          
          let x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;

          if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
          }
        });
      }

      force.initialize = function (_) {
        nodes = _;
      }

      force.strength = _ => {
        strength = _ == null ? strength : _;
        return force;
      };

      return force;
    }
  }

  update() {
    
  }
}