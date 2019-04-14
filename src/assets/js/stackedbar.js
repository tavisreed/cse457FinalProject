// Source: Assignment 2

class StackedBar {
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

    // set data
    let bar_data = [self.data.graduate_enroll, self.data.undergrad_enroll];

    var svg = d3.select('#' + self.parent).html('')
      .attr("width", self.width + self.margin.left + self.margin.right)
      .attr("height", self.height + self.margin.top + self.margin.bottom);

    var g = svg.append("g").attr("transform", "translate(" + self.width/2 + "," + self.height/2 + ")");

     var rect_height = self.height/3;

    var x_scale = d3.scaleLinear()
      .rangeRound([0, self.width*.75])
      .domain([0,(bar_data[0]+bar_data[1])]);

    // colors need to be updated
    var color_scale = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
      .domain([0,2]);

    // create the rectangles for the stacked bar
    g.selectAll("rect")
      .data(bar_data)
      .enter()
      .append("rect")
      .attr("fill", function(d,i){
        return color_scale(i);
      })
      .attr("height", rect_height)
      .attr("width", function(d,i){
        return x_scale(d);
      })
      .attr("y", 10)
      .attr("x", function(d,i){
        if (i == 0){
          return 0;
        }
        else{
          return x_scale(bar_data[i-1]);
        }
      });

    // create text above the bars
    g.selectAll("text")
      .data(bar_data)
      .enter()
      .append("text")
      .attr("y", 5)
      .attr("x", function(d,i){
        if (i == 0){
          return 0;
        }
        else{
          return x_scale(bar_data[i-1]);
        }
      })
      .text(function(d,i) {
        if (d == 0) {
          return "";
        }
        else if (i == 0) {
          return "G: "+d;
        } else {
          return "U: "+d;
        }
      });
  }
}