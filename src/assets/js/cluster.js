class Cluster {
  constructor(_parent, _data) {
    this.parent = _parent;
    this.data = _data;
    this.init();
  }

  init() {
    let self = this;

    // process data
    self.preprocessing();

    // initialize plot
    self.margin = {top: 120, right: 120, bottom: 120, left: 120};
    self.width = window.innerWidth/1.1 - self.margin.left - self.margin.right;
    self.height = window.innerHeight/1.25 - self.margin.top - self.margin.bottom;
    self.padding = 1.5, // separation between same-color nodes
    self.clusterPadding = 6, // separation between different-color nodes
    self.maxRadius = 12;

    // svg setup
    self.svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom);
    self.g = self.svg.append("g").attr("id","clusterG").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    self.n = 500;
    self.color = d3.scaleSequential(d3.interpolateRainbow)
        .domain(d3.range(12));

    self.radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([0,20])
      .domain([0,120000]);

    self.showClusterLegend();

    // initial force layout setup
    self.simulation = d3.forceSimulation()
      .on('tick', tick);

    self.change_mode('schools');

    // self.circles = self.g.selectAll('circle')
    //     .data(self.nodes)
    //   .enter().append('circle');

    // ramp up collision strength to provide smooth transition
    // var transitionTime = 1000;
    // var t = d3.timer(function (elapsed) {
    //   var dt = elapsed / transitionTime;
    //   self.simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
    //   if (dt >= 1.0) t.stop();
    // });

    function tick() {
      self.circles
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('r', function(d) { return d.r; })
        .style('fill', function(d) { return self.color(d.color); })
    }
  }

  preprocessing() {
    let self = this;

    let total = 0;
    let totals = {};
    let gen_totals = {};
    let eth_totals = {};
    let tables = ['freshmen_enroll_table','sophomore_enroll_table','junior_enroll_table','senior_enroll_table'];

    self.data['2018'].forEach(function(d) {
      for (let table of tables) {
        for (let gen of Object.keys(d[table]['total'])) {
          for (let eth of Object.keys(d[table]['total'][gen])) {
            if (!totals[gen]) totals[gen] = {};
            if (!totals[gen][eth]) totals[gen][eth] = 0;
            totals[gen][eth] += d[table]['total'][gen][eth];

            if (!gen_totals[gen]) gen_totals[gen] = 0;
            gen_totals[gen] += d[table]['total'][gen][eth]

            if (!eth_totals[eth]) eth_totals[eth] = 0;
            eth_totals[eth] += d[table]['total'][gen][eth]

            total += d[table]['total'][gen][eth];
          }
        }
      }
    });

    self.vdata = {
      'all': totals,
      'gender': gen_totals,
      'ethnicity': eth_totals,
      'total': total
    }
  }

  showClusterLegend() {
    let self = this;
    var gDiv =  self.svg.append("g").attr('id','legend');
    var gHeight = self.height/3;
    gDiv.attr("transform", "translate("+self.width/1.1+","+0+")");
    gDiv.append("g").attr("transform", "translate(75," + (gHeight*0.15)+")").append("text").text("Total Enrollment")
    gDiv.append("circle").attr("r", self.radiusScale(120000)).style("fill","grey").attr("cy",gHeight*0.4).attr("cx", 100);
    gDiv.append("g").attr("transform", "translate(125," + (gHeight*0.4)+")").append("text").text("120000")
    gDiv.append("circle").attr("r", self.radiusScale(67500)).style("fill","grey").attr("cy",(gHeight*0.4)+40).attr("cx", 100);
    gDiv.append("g").attr("transform", "translate(125," + ((gHeight*0.4)+40)+")").append("text").text("67500")
    gDiv.append("circle").attr("r", self.radiusScale(30000)).style("fill","grey").attr("cy",(gHeight*0.4)+70).attr("cx", 100);
    gDiv.append("g").attr("transform", "translate(125," + ((gHeight*0.4)+70)+")").append("text").text("30000")
    gDiv.append("circle").attr("r", self.radiusScale(7500)).style("fill","grey").attr("cy",(gHeight*0.4)+90).attr("cx", 100);
    gDiv.append("g").attr("transform", "translate(125," + ((gHeight*0.4)+90)+")").append("text").text("7500")
  }

  /*
   * Change cluster group. A group is the attribute by which the nodes are clustered.
   * Changing groups occurs within modes, and transition context is preserved.
   * The current groups across all modes are
   * - Student mode
   *   (1) both: group by gender and ethnicity
   *   (2) ethnicity: group only by ethnicity
   *   (3) gender: group only by gender
   * - School mode
   *   (1) school: group by school type (public/private)
   *   (2) tuition: beesward by tuition
   *
   */
  update(group) {
    let self = this;
    let clusters = [];
    let alpha = 0.2;
    let alphaTarget = 0;
    let force_group = 'cluster';

    // student mode
    if (group == 'both') {
      clusters = [2,6];
    } else if (group == 'gender') {
      clusters = [2,1];
    } else if (group == 'ethnicity') {
      clusters = [1,6];
    }

    // school mode
    if (group == 'school') {
      clusters = [1,1];
    } else if (group == 'school_type') {
      clusters = [1,2];
    } else if (group == 'tuition') {
      clusters = [0,0];
      force_group = 'beeswarm';
      alpha = 0.1;
      alphaTarget = 0.4;
      self.scale = d3.scaleLinear()
        .domain([0,60000])
        .range([0,self.width]);
    }

    self.compute_clusters(clusters[0], clusters[1]);
    self.set_nodes(group);
    self.force_setup(force_group, alpha, alphaTarget);

    self.simulation.restart();
  }

  /*
   * Change cluster modes. A mode defines the meaninig of the nodes in the cluster.
   * The current modes are:
   * (1) Schools
   * (2) Students
   */
  change_mode(mode) {
    let self = this;

    if (mode == 'schools') {
      // show search bar
      document.querySelector('#search_bar').style.display = 'block';
      document.querySelector('#legend').style.display = 'block';

      // create schools nodes
      self.nodes = self.data['2018'].map(function(d,i) {
        let node = {
              data: d,
              cluster: [0, 0],
              r: self.radiusScale(d.graduate_enroll+d.undergrad_enroll),
              color: 0.75,
              x: window.innerWidth*Math.random(),
              y: window.innerHeight*Math.random()
            };
        return node;
      });

      // call default update
      self.update('school');
    } else if (mode == 'students') {
      // hide search bar
      document.querySelector('#search_bar').style.display = 'none';
      document.querySelector('#legend').style.display = 'none';

      let node_data = [];
      let i = 0;
      for (let gen of Object.keys(self.vdata.all)) {
        let j = 0;
        for (let eth of Object.keys(self.vdata.all[gen])) {
          let num = Math.ceil(self.vdata.all[gen][eth]*self.n/self.vdata.total);
          for (let k=0; k<num; k++) {
            node_data.push({'cluster': [i,j], 'gender':gen, 'ethnicity':eth});
          }
          j++;
        }
        i++;
      }

      // create nodes from data
      self.nodes = node_data.map(function(d,i) {
        let node = {
              data: d.cluster,
              cluster: d.cluster,
              r: 4,
              color: (d.cluster[0]+1)*(d.cluster[1]+1)/12,
              x: window.innerWidth/2,
              y: window.innerHeight/2
            };
        return node;
      });

      // call default update
      self.update('both');
    }

    // update pattern on circles
    self.circles = self.g.selectAll('circle')
      .data(self.nodes);

    if (mode == 'schools') {
      self.circles.enter().append('circle')
        .merge(self.circles)
          .on('click', function(d) {
             $('#selection').val(d.data.index).trigger('change');
             $('#nav-profile-tab').trigger('click');
           })
          .attr('id', function(d) {
              return d.data.name.replace(/[ &.\-,']/g,'');
          })
          .append('svg:title').text(function(d) { return d.data.name; });
    } else {
      self.circles.enter().append('circle')
        .merge(self.circles)
          .on('click', null)
          .attr('id', null)
    }

    self.circles.exit().remove();

    self.circles = self.g.selectAll('circle');
  }

  compute_clusters(rows, cols) {
    let self = this;

    let xpad = 60, ypad = 20; 
    self.clusters = [];
    for (let i=0; i<rows; i++) {
      let row = [];
      for (let j=0; j<cols; j++) {
        let pos = {
          x: (self.width-2*xpad)*j/(cols-1) + xpad,
          y: (self.height-2*ypad)*i/(rows-1) + ypad
        };
        if (rows <= 1) {
          pos.y = self.height/2;
        }
        if (cols <= 1) {
          pos.x = self.width/2;
        }
        row.push(pos);
      }
      self.clusters.push(row);
    }
    return self.clusters;
  }

  update_legend() {
    // handle legend  
    let legend = self.svg.append('g')
        .style("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .attr("transform", function(d, i) { return "translate(" + (full_width/2+radius+40) + "," + (full_height/2-40) + ")"; })
      .selectAll("g")
      .data(pie(data))
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i*20 + ")"; });

    legend.append("rect")
        .attr("x", 5)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function(d, i) { return clr(i); });

    legend.append("text")
        .attr("y", 7.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d.data.animal; });
  }

  force_setup(group, alpha=0.2, alphaTarget=0) {
    let self = this;

    function cluster(alpha) {
      for (let i = 0, n = self.nodes.length; i < n; ++i) {
        let k = alpha * 1;
        let node = self.nodes[i];
        let cluster = self.clusters[node.cluster[0]][node.cluster[1]];
        node.vx -= (node.x - cluster.x) * k;
        node.vy -= (node.y - cluster.y) * k;
      }
    }

    if (group == 'cluster') {
      self.simulation
        .alpha(alpha).alphaTarget(alphaTarget).alphaMin(0)
        .force('cluster', cluster)
        .force('charge', d3.forceManyBody()
          .strength(-30))
        .force('collide', d3.forceCollide(function(d) { return d.r + self.padding; })
          .strength(0.6))
        .force('x', null)
        .force('y', null)
        .nodes(self.nodes);
    } else if (group == 'beeswarm') {
      self.simulation
        .alpha(alpha).alphaTarget(alphaTarget).alphaMin(0)
        .force('cluster', null)
        .force('charge', d3.forceManyBody()
          .strength(-2))
        .force('collide', d3.forceCollide(function(d) { return d.r + self.padding; })
          .strength(0.4))
        .force('x', d3.forceX().x(function(d) { return self.scale(d.data.tuition[0]); })
          .strength(1))
        .force('y', d3.forceY(200)
          .strength(0.2))
        .nodes(self.nodes);
    }
  }

  /* Within mode node updates. */
  set_nodes(group) {
    let self = this;

    // school mode
    if (group == 'school') {
      self.nodes.forEach(function(d) {
        d.cluster = [0,0];
        d.color = 0.75;
      });
    } else if (group == 'school_type') {
      self.nodes.forEach(function(d) {
        d.cluster = [0, d.data.type == 'PUBLIC' ? 0 : 1];
        d.color = d.data.type == 'PUBLIC' ? 0.1 : 0.7;
      });
    } else if (group == 'tuition') {
      
    }

    // student mode
    if (group == 'both') {
      self.nodes.forEach(function(d) {
        d.cluster = [d.data[0],d.data[1]];
        d.color = (d.data[0]+1)*(d.data[1]+1)/12;
      });
    } else if (group == 'gender') {
      self.nodes.forEach(function(d) {
        d.cluster = [d.data[0],0];
        d.color = d.data[0]/2;
      });
    } else if (group == 'ethnicity') {
      self.nodes.forEach(function(d) {
        d.cluster = [0,d.data[1]];
        d.color = d.data[1]/6;
      });
    }
  }
}