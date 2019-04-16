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
    console.log(self.vdata);
    // initialize plot
    self.margin = {top: 120, right: 120, bottom: 120, left: 120};
    self.width = window.innerWidth/1 - self.margin.left - self.margin.right;
    self.height = window.innerHeight/1.25 - self.margin.top - self.margin.bottom;
    self.padding = 1.5, // separation between same-color nodes
    self.clusterPadding = 6, // separation between different-color nodes
    self.maxRadius = 12;

    // svg setup
    self.svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom);
    self.g = self.svg.append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    self.n = 500;
    self.color = d3.scaleSequential(d3.interpolateRainbow)
        .domain(d3.range(12));

    // initial force layout setup
    self.simulation = d3.forceSimulation()
      .on('tick', tick);

    self.compute_clusters(2,6);
    self.set_nodes('initial');
    self.force_setup('cluster');

    self.circles = self.g.selectAll('circle')
        .data(self.nodes)
      .enter().append('circle');

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

  update(group) {
    let self = this;
    let clusters = [];
    let alpha = 0.2;
    let alphaTarget = 0;
    let force_group = '';

    if (group == 'both') {
      clusters = [2,6];
      force_group = 'cluster';
    } else if (group == 'gender') {
      clusters = [2,1];
      force_group = 'cluster';
    } else if (group == 'ethnicity') {
      clusters = [1,6];
      force_group = 'cluster';
    } else if (group == 'school') {
      clusters = [1,2];
      force_group = 'cluster';
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
    console.log('Group: ' + group)
    console.log('Num nodes: ' + self.nodes.length);
    self.force_setup(force_group, alpha, alphaTarget);

    let t = d3.transition().duration(500);

    self.circles = self.circles.data(self.nodes);

    self.circles.enter().append('circle')
      // new attr only
      .on("click", function(d) {
         $("#selection").val(d.index).trigger('change');
         $('#nav-profile-tab').trigger('click');
       })
      .attr("id", function(d) {
          //return d.da.replace(/[ .\-,']/g,'');
      })
      .merge(self.circles)
      // all attr

    self.circles.exit().remove();

    self.circles = self.g.selectAll('circle');

    self.simulation.restart();
  }

  compute_clusters(rows, cols) {
    let self = this;

    let xpad = 40, ypad = 20; 
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
        .alpha(alpha).alphaTarget(alphaTarget)
        .force('cluster', cluster)
        .force('charge', d3.forceManyBody()
          .strength(-20))
        .force('collide', d3.forceCollide(function(d) { return d.r + self.padding; })
          .strength(0.4))
        .force('x', null)
        .force('y', null)
        .nodes(self.nodes);
    } else if (group == 'beeswarm') {
      self.simulation
        .alpha(alpha).alphaTarget(alphaTarget)
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

  set_nodes(group) {
    let self = this;

    if (group == 'initial') {
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
              x: window.innerWidth*Math.random(),
              y: window.innerHeight*Math.random()
            };
        return node;
      });
    } else if (group == 'both') {
      self.set_nodes('initial');
      self.nodes.forEach(function(d) {
        d.cluster = [d.data[0],d.data[1]];
        d.color = (d.data[0]+1)*(d.data[1]+1)/12;
      });
    } else if (group == 'gender') {
      self.set_nodes('initial');
      self.nodes.forEach(function(d) {
        d.cluster = [d.data[0],0];
        d.color = d.data[0]/2;
      });
    } else if (group == 'ethnicity') {
      self.set_nodes('initial');
      self.nodes.forEach(function(d) {
        d.cluster = [0,d.data[1]];
        d.color = d.data[1]/6;
      });
    } else if (group == 'school') {
      self.nodes = self.data['2018'].map(function(d,i) {
        console.log(d.undergrad_enroll);
        let node = {
              data: d,
              cluster: [0, d.type == 'PUBLIC' ? 0 : 1],
              r: Math.log(d.undergrad_enroll/100),
              color: d.type == 'PUBLIC' ? 0 : 0.5,
              x: window.innerWidth*Math.random(),
              y: window.innerHeight*Math.random()
            };
        return node;
      });
    } else if (group == 'tuition') {
      
    }
  }
}