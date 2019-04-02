class Histogram {
  constructor(_parent, _data) {
    this.parent = _parent;
    this.data = _data;
    this.init();
  }

  init(argument) {
    let self = this;

    // initialize plot
    self.margin = {top: 30, right: 30, bottom: 30, left: 30};
    self.width = 650 - self.margin.left - self.margin.right;
    self.height = 300 - self.margin.top - self.margin.bottom;

    var svg = d3.select('#' + self.parent).append('svg')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom),
      g = svg.append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    let hist_data = self.data['2018'];
    console.log(hist_data);

    var x = d3.scaleLinear()
        .domain([0,d3.max])
        .range([0,self.width]);

    var histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(50))

    var bins = histogram();
      
    var y = d3.scaleLinear()
        .range([self.height,0])
        .domain([0,d3.max(bins, function(d) { return d.length; })]);

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + self.height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(y));

    var bar = g.selectAll('.bar')
      .data(bins)
      .enter().append('g')
        .attr('class','bar')
        .attr('transform', function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append('rect')
        .attr('x',1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("fill", 'black')
        .attr("height", function(d) { return self.height - y(d.length); })
  }
}