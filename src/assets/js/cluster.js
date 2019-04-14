class Cluster {
  constructor(_parent, _data) {
    this.parent = _parent;
    this.data = _data;
    this.init();
  }

  init() {
    let self = this;

    // process data
    self.preprocessing(self.data);

    // update message, data done loading
    document.querySelector('#home-message').style.display = 'none';

    // initialize plot
    self.margin = {top: 30, right: 30, bottom: 30, left: 60};
    self.width = window.innerWidth/1 - self.margin.left - self.margin.right;
    self.height = window.innerHeight/1.5 - self.margin.top - self.margin.bottom;
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
    self.clusters = [{x:200,y:100},{x:500,y:200}];

    // create nodes from data
    self.nodes = self.vdata.map(function(d) {
      let node = {
            data: d,
            cluster: d.type == 'PUBLIC' ? 0 : 1,
            r: d.tuition ? d.tuition[0]/5000 : 0,
            x: Math.cos(cluster / m * 2 * Math.PI) * 100 + self.width / 2 + Math.random(),
            y: Math.sin(cluster / m * 2 * Math.PI) * 100 + self.height / 2 + Math.random()
          };
      //if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = node;
      return node;
    });

    self.circles = self.g.selectAll('circle')
        .data(self.nodes)
      .enter().append('circle')
        .style('fill', function(d) { return color(d.cluster/10); });

    self.circles.append('svg:title')
      .text(function(d) { return d.data.name; })

    // force layout setup
    self.force = d3.forceSimulation()
      // center simulation
      //.force('center', d3.forceCenter(self.width/2, self.height/2))

      // cluster by section
      .force('cluster', cluster())

      // apply collision with padding
      .force('collide', d3.forceCollide(d => d.r + self.padding)
        .strength(0.7))

      // updates to perform each tick
      .on('tick', tick)
      .nodes(self.nodes);

    // ramp up collision strength to provide smooth transition
    var transitionTime = 3000;
    var t = d3.timer(function (elapsed) {
      var dt = elapsed / transitionTime;
      self.force.force('collide').strength(Math.pow(dt, 2) * 0.7);
      if (dt >= 1.0) t.stop();
    });

    function tick() {
      self.circles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; });
    }

    // function cluster(alpha) {
    //   for (var i = 0, n = self.nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
    //     node = self.nodes[i];
    //     cluster = self.clusters[node.cluster];
    //     node.vx -= (node.x - cluster.x) * k;
    //     node.vy -= (node.y - cluster.y) * k;
    //   }
    // }

    function cluster() {
      let strength = 0.1;

      function force(alpha) {
        // scale + curve alpha value
        alpha *= strength * alpha;

        self.nodes.forEach(function(d) {
          let cluster = self.clusters[d.cluster];
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

  preprocessing(data) {
    let self = this;
    self.vdata = data['2018'];
  }

  update() {
    // The largest node for each cluster.
    var clusters = new Array(m);

    // set clusters
    clusters = [{x:200,y:200},{x:500,y:200}];

    // update node clusters
    self.nodes.forEach(function(d) {
      // update d cluster
    });
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