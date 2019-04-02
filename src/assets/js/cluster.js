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
    self.width = window.innerWidth/2.2 - self.margin.left - self.margin.right;
    self.height = 200 - self.margin.top - self.margin.bottom;
    self.padding = 1.5, // separation between same-color nodes
    self.clusterPadding = 6, // separation between different-color nodes
    self.maxRadius = 12;

    // set data
    let line_data = self.data;

    let n = 200, // total number of nodes
        m = 10; // number of distinct clusters

    let color = d3.scale.category10()
        .domain(d3.range(m));

    // The largest node for each cluster.
    let clusters = new Array(m);

    let nodes = d3.range(n).map(function() {
      let i = Math.floor(Math.random() * m),
          r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
          d = {
            cluster: i,
            radius: r,
            x: Math.cos(i / m * 2 * Math.PI) * 200 + self.width / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 200 + self.height / 2 + Math.random()
          };
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    });

    let force = d3.layout.force()
        .nodes(nodes)
        .size([self.width, self.height])
        .gravity(.02)
        .charge(0)
        .on("tick", tick)
        .start();

    let svg = d3.select("body").append("svg")
        .attr("width", self.width)
        .attr("height", self.height);

    let node = svg.selectAll("circle")
        .data(nodes)
      .enter().append("circle")
        .style("fill", function(d) { return color(d.cluster); })
        .call(force.drag);

    node.transition()
        .duration(750)
        .delay(function(d, i) { return i * 5; })
        .attrTween("r", function(d) {
          let i = d3.interpolate(0, d.radius);
          return function(t) { return d.radius = i(t); };
        });

    function tick(e) {
      node
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return function(d) {
        let cluster = clusters[d.cluster];
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
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      let quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        let r = d.radius + maxRadius + Math.max(self.padding, self.clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            let x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? self.padding : self.clusterPadding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
}