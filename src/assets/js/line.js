class Line {
  constructor(_parent, _data, _data2, _numberlines) {
    this.parent = _parent;
    this.data = _data;;
    this.data2=_data2;
    this.numberlines=_numberlines
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
    let second_line_data = self.data2;

    line_data = line_data.filter(function(d) {
      return d.value != 'n';
    });

    var svg = d3.select('#' + self.parent).html('')
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom),
      g = svg.append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
    self.g = g;

    var x = d3.scaleTime()
        .domain(d3.extent(line_data, function(d) { return d.date; }))
        .range([0, self.width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(line_data, function(d) { return d.value; })])
        .range([self.height, 0]);


    //Create a second line if needed
    if(self.numberlines==2){
      var line2 = d3.line()
          .defined(function(d) { return d.value != 'none' ? d : null; })
          //.curve(d3.curveBasis)
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.value); });

      y = d3.scaleLinear()
          .domain([0, d3.max(second_line_data, function(d) { return d.value; })])
          .range([self.height, 0]);

      g.append('path')
          .data([second_line_data])
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke', 'red')
          .attr('stroke-width', '1.5px')
          .attr('d', line2);
    }
    // define line
    var line = d3.line()
        .defined(function(d) { 
          return d.value != 'n'; 
        })
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); });

    g.append('path')
        .data([line_data])
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', '1.5px')
        .attr('d', line);



    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + self.height + ")")
        .call(d3.axisBottom(x));
 
        g.append('g').attr('transform',"translate("+(self.width/2) +","+ (self.height+30) +")").append('text').style('font-size',12).text("Year");
    
     g.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(y));

    g.append('g').attr('transform',"translate(-47 ,"+ (self.height/1.25) +") rotate(270)").append('text').style('font-size',12).text("Tuition");

  }

  updateVis() {
    var self = this;
    d3.select('#' + self.parent)
        .selectAll(".x-axis")
        .remove();

    d3.select('#' + self.parent)
        .selectAll(".y-axis")
        .remove();

    d3.select('#' + self.parent)
        .selectAll("path")
        .remove();

    var x = d3.scaleTime()
        .domain(d3.extent(self.displayData, function(d) { return d.date; }))
        .range([0, self.width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(self.displayData, function(d) { return d.value; })])
        .range([self.height, 0]);

    if (self.numberlines==2){
      y = d3.scaleLinear()
          .domain([0, d3.max(self.displayData2, function(d) { return d.value; })])
          .range([self.height, 0]);


      var line2 = d3.line()
          .defined(function(d) { return d != 'none'; })
          //.curve(d3.curveBasis)
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.value); });


      self.g.append('path')
          .data([self.displayData2])
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke', 'red')
          .attr('stroke-width', '1.5px')
          .attr('d', line2);
    }

    self.g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + self.height + ")")
        .call(d3.axisBottom(x));

        

    self.g.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(y));

      
    var line = d3.line()
        .defined(function(d) { return d.value != 'n'; })
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); });


    self.g.append('path')
        .data([self.displayData])
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', '1.5px')
        .attr('d', line);



  }

  onSelectionChange(selectionStart, selectionEnd){
    var vis = this;

    vis.displayData=vis.data.filter(function(d){
      if (d.date >= selectionStart && d.date<=selectionEnd){
        return true;
      }
      else{
        return false;
      }
    });

    vis.displayData2=vis.data2.filter(function(d){
      if (d.date >= selectionStart && d.date<=selectionEnd){
        return true;
      }
      else{
        return false;
      }
    });

    vis.updateVis();

  }
}