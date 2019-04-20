// Source: Assignment 2

class StackedBar {
  constructor(_parent, _data, _catagories) {
    this.parent = _parent;
    this.data = _data;
    this.catagories=_catagories;
    this.init();
  }

  init(argument) {
    let self = this;

    // initialize plot
    self.margin = {top: 30, right: 30, bottom: 30, left: 60};
    self.width = window.innerWidth/2.2 - self.margin.left - self.margin.right;
    self.height = 100 - self.margin.top - self.margin.bottom;

    // set data
    var bar_data =[];
    for(var i=0;i<self.data.length;i++){
      var temp={
          value:self.data[i],
          name:self.catagories[i]
      }
      bar_data.push(temp);
    }
    //bar_data.sort(function(a,b){return a.value-b.value})
    var svg = d3.select('#' + self.parent).html('')
      .attr("width", self.width + self.margin.left + self.margin.right)
      .attr("height", self.height + self.margin.top + self.margin.bottom);

    var g = svg.append("g")//.attr("transform", "translate(" + self.width/2 + "," + self.height/2 + ")");

    var rect_height = self.height*.9;

    var max_value=0;
    for (var i=0;i<bar_data.length;i++){
      if (max_value<bar_data[i].value){
        max_value=bar_data[i].value;
      }
    }

    var x_scale = d3.scaleLinear()
      .rangeRound([0, self.width*.75])
      .domain([0,max_value]);

    // colors need to be updated
    var color_scale = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
      .domain([0,self.catagories.length]);


    //Delete old rectangles
      svg.selectAll("rect")
          .remove();

    // create the rectangles for the stacked bar
    var barX = [0]
    for(var i = 0; i<bar_data.length; ++i){
      barX.push(barX[i]+(bar_data[i].value/100)*self.width);
    }

    var tip = d3.tip().attr('class', 'd3-tip')
        .html(function (d) {
            var tooltip_data = {
                "name": d.name,
                "percent": d.value
            };
            return self.tooltip_render(tooltip_data);
    });

    svg.call(tip);

    g.selectAll("rect")
      .data(bar_data)
      .enter()
      .append("rect")
      .attr("fill", function(d,i){
        console.log(d.name);
        return color_scale(i);
      })
      .attr("height", rect_height)
      .attr("width", function(d,i){
        
        return (d.value/100)*(self.width);
      })
      .attr("y", 10)
      .attr("x", function(d,i){
        return barX[i];
      })
        .on("mouseover", function(d,i){
          //var selection_text=d.name;
          tip.show(d);
          //var selection_id="#"+self.parent+"_selection";
          
          //$( selection_id ).html("Selection: "+selection_text);
        })
        .on("mouseout", function(d,i){
          //var selection_id="#"+self.parent+"_selection";
          tip.hide(d);
          //$( selection_id ).html("Selection: ");
        });

    // create text above the bars
    
  
  }
  tooltip_render (tooltip_data) {
    var vis = this;
    var text = "<div> <p>" + tooltip_data.name + "</p><p> " + tooltip_data.percent + "%</p></div>";
    return text;
}
}