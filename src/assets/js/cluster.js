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

    // update message, data done loading
    document.querySelector('#home-message').style.display = 'none';

    // initialize plot
    self.margin = {top: 120, right: 120, bottom: 120, left: 120};
    self.width = window.innerWidth/1 - self.margin.left - self.margin.right;
    self.height = window.innerHeight/1.4 - self.margin.top - self.margin.bottom;
    self.padding = 1.5, // separation between same-color nodes
    self.clusterPadding = 6, // separation between different-color nodes
    self.maxRadius = 12;

    // svg setup
    self.svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom);
    self.g = self.svg.append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    // force variables
    let m = 10; // number of distinct clusters
    var color = d3.scaleSequential(d3.interpolateRainbow)
        .domain(d3.range(m));

    // initialize clusters
    self.cols = 5
    self.rows = 2
    let xpad = 50, ypad = 20; 
    self.clusters = [];
    for (let i=0; i<self.rows; i++) {
      let row = [];
      for (let j=0; j<self.cols; j++) {
        row.push({
          x: (self.width-2*xpad)*j/(self.cols-1) + xpad,
          y: (self.height-2*ypad)*i/(self.rows-1) + ypad
        });
      }
      self.clusters.push(row);
    }

    // create nodes from data
    self.nodes = d3.range(100).map(function(d,i) {
      let node = {
            data: d,
            cluster: [Math.floor(Math.random()*self.rows),Math.floor(Math.random()*self.cols)],
            //d.type == 'PUBLIC' ? 0 : 1,
            r: Math.random()*30,
            //d.tuition ? d.tuition[0]/5000 : 0,
            x: window.innerWidth*Math.random(),
            y: window.innerHeight*Math.random()
          };
      //if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = node;
      return node;
    });

    self.circles = self.g.selectAll('circle')
        .data(self.nodes)
      .enter().append('circle')
        .style('fill', function(d) { return color((d.cluster[0]+d.cluster[1])/(self.rows*self.cols)); });

    self.circles.append('svg:title')
      .text(function(d) { return d.data.name; })

    // force layout setup
    self.force = d3.forceSimulation()
      .alpha(0.2).alphaMin(0)
      // center simulation
      //.force('center', d3.forceCenter(self.width/2, self.height/2))

      // cluster by section
      .force('cluster', cluster)

      // little charge
      .force("charge", d3.forceManyBody()
        .strength(-200))

      // apply collision with padding
      .force('collide', d3.forceCollide(d => d.r + self.padding)
        .strength(0.2))

      // updates to perform each tick
      .on('tick', tick)
      .nodes(self.nodes);

    // ramp up collision strength to provide smooth transition
    // var transitionTime = 1000;
    // var t = d3.timer(function (elapsed) {
    //   var dt = elapsed / transitionTime;
    //   self.force.force('collide').strength(Math.pow(dt, 2) * 0.7);
    //   if (dt >= 1.0) t.stop();
    // });

    function tick() {
      self.circles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; });
    }

    function cluster(alpha) {
      for (let i = 0, n = self.nodes.length; i < n; ++i) {
        let k = alpha * 1;
        let node = self.nodes[i];
        let cluster = self.clusters[node.cluster[0]][node.cluster[1]];
        node.vx -= (node.x - cluster.x) * k;
        node.vy -= (node.y - cluster.y) * k;
      }
    }
  }

  preprocessing() {
    let self = this;

    let totals = {};
    let tables = ['freshmen_enroll_table','sophomore_enroll_table','junior_enroll_table','senior_enroll_table'];
    let eth_total = 0;
    let gen_total = 0;

    self.data['2018'].forEach(function(d) {
      for (let table of tables) {
        for (let group of Object.keys(d[table])) {
          for (let item of Object.keys(d[table][group])) {
            //if (!totals[table]) totals[table] = {};
            if (!totals[group]) totals[group] = {};
            if (!totals[group][item]) totals[group][item] = 0;
            totals[group][item] += d[table][group][item];
            if (item == 'male' || item == 'female') {
              gen_total += d[table][group][item];
            } else {
              eth_total += d[table][group][item];
            }
          }
        }
      }
    });
  }

  update() {
    let self = this;

    // set clusters
    //self.clusters = [{x:200,y:200},{x:500,y:200}];

    // update node clusters
    self.nodes.forEach(function(d) {
      // update d cluster
      d.cluster = [0,0];
      //[Math.floor(Math.random()*self.rows),Math.floor(Math.random()*self.cols)];
    });

    self.force.alpha(0.2).restart();
  }

  // Move d to be adjacent to the cluster node.
  // from: https://bl.ocks.org/mbostock/7881887
  cluster() {
    let strength = 0.1;

    function force(alpha) {
      // scale + curve alpha value
      alpha *= strength * alpha;

      nodes.forEach(function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        
        let x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.r + cluster.r;

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

    force.strength = function (_) {
      strength = _ == null ? strength : _;
      return force;
    };

    return force;
  }
}