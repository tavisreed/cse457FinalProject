class Line {
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

    // set data
    let line_data = self.data;

    var svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom),
      g = svg.append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    var x = d3.scaleTime()
        .domain(d3.extent(line_data, function(d) { return d.date; }))
        .range([0, self.width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(line_data, function(d) { return d.value; })])
        .range([self.height, 0]);

    // define line
    var line = d3.line()
        .defined(function(d) { return d != 'none'; })
        //.curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); });

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + self.height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(y));

    g.append('path')
        .data([line_data])
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', '1.5px')
        .attr('d', line);
  }
}