class Pie {
  constructor(_parent, _data) {
    this.parent = _parent;
    this.data = _data;
    this.init();
  }

  init(argument) {
    let self = this;

    // initialize plot
    self.margin = {top: 30, right: 30, bottom: 30, left: 60};
    self.width = window.innerWidth/2.2 - self.margin.left - self.margin.right;
    self.height = 200 - self.margin.top - self.margin.bottom;

    self.radius= Math.min(self.width, self.height)*.75;
    // set data
    let pie_data = [self.data.graduate_enroll,self.data.undergrad_enroll];

    var svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom)
        .append("g").attr("transform", "translate(" + self.width*.3 + "," + self.height*.7 + ")");


    //source:https://bl.ocks.org/santi698/f3685ca8a1a7f5be1967f39f367437c0

    var color = d3.scaleOrdinal()
      .range(["#ffc6e8", "#99ff99"]);

    var arc = d3.arc()
      .outerRadius(self.radius - 10)
      .innerRadius(0);

    var labelArc = d3.arc()
      .outerRadius(self.radius+10)
      .innerRadius(self.radius+10);

    var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d; });

    var g = svg.selectAll(".arc")
      .data(pie(pie_data))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data); });

    g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d,i) {
        if (d.data==0) {
          return "";
        }
        else if (i==0) {
          return "G: "+d.data;
        } else {
          return "U: "+d.data;
        }
         });
  }
}