class Cluster {
  constructor(_parent, _data) {
    this.parent = _parent;
    this.data = _data;
    this.profile = _profile;
    this.init();
  }

  init() {
    let self = this;

    // initialize plot
    self.margin = {top: 30, right: 30, bottom: 30, left: 60};
    self.width = window.innerWidth/1.5 - self.margin.left - self.margin.right;
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

    var nodes = self.data['2018'].map(function(e) {
      var i = Math.floor(Math.random() * m),
          r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * self.maxRadius,
          pub = 0;

      if (e.type != 'none') {
        pub = e.type == 'PUBLIC' ? 0 : 1;
      }
      i=pub;

      let d = {
            data: e,
            cluster: i,
            radius: e.tuition != 'none' ? e.tuition[0]/5000 : 1,
            x: Math.cos(i / m * 2 * Math.PI) * 100 + self.width / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 100 + self.height / 2 + Math.random()
          };
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    });
      
    var force = d3.forceSimulation()
      // keep entire simulation balanced around screen center
      .force('center', d3.forceCenter(self.width/2, self.height/2))

      // cluster by section
      .force('cluster', cluster()
        .strength(0.2))

      // apply collision with padding
      .force('collide', d3.forceCollide(d => d.radius + self.padding)
        .strength(0))

      .on('tick', layoutTick)
      .nodes(nodes);

    var node = g.selectAll("circle")
        .data(nodes)
      .enter().append("circle")
        .style("fill", function(d) { return color(d.cluster/10); });

    node.on("click", function(d){
      //self.profile.load_profile(d.data.name, '2018');
      $("#selection").val(d.data.index).trigger('change');
      $('#nav-profile-tab').trigger('click');
    })

    node.append('svg:title')
      .text(function(d) { return d.data.name; })

    // ramp up collision strength to provide smooth transition
    var transitionTime = 3000;
    var t = d3.timer(function (elapsed) {
      var dt = elapsed / transitionTime;
      force.force('collide').strength(Math.pow(dt, 2) * 0.7);
      if (dt >= 1.0) t.stop();
    });
      
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
}