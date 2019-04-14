// source: studio 6

class StackedArea {
    constructor(_parent, _data, _categories) {
        this.parent = _parent;
        this.data = _data;
        this.categories = _categories;
        this.init();
    }

    init() {
        var vis = this;
        vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        vis.colorScale.domain(d3.keys(vis.categories).filter(function(d){ return d != "date"; }))
       // vis.colorScale.domain(vis.categories);

        // initialize plot
        vis.margin = {top: 30, right: 30, bottom: 30, left: 60};
        vis.width = window.innerWidth/2.2 - vis.margin.left - vis.margin.right;
        vis.height = 200 - vis.margin.top - vis.margin.bottom;

        // set data
        let data =vis.data;

        var max_enroll=0;

        for (var i=0;i<data.length;i++){
            var combined=data[i].graduate_enroll+data[i].undergrad_enroll;
            if (combined>max_enroll){
                max_enroll=combined;
            }
        }


        //Clear out old table
        d3.select("#" + vis.parent)
            .selectAll("g")
            .remove();

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parent)
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");



        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.data, function(d) { return d.date; }));
        // .domain([data[0].date.getFullYear(),data[data.length-1].date.getFullYear()]);
        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.svg.append("g")
            .attr("class", "y-axis axis");


        var dataCategories = vis.categories;
        var stack=d3.stack().keys(dataCategories);
        var stackedData = stack(this.data);
        vis.displayData =stackedData;


        vis.area = d3.area()
            .x(function(d) {
                return vis.x(d.data.date); })
            .y0(function(d) { return vis.y(d[0]); })
            .y1(function(d) { return vis.y(d[1]); });



        vis.updateVis();
    }

    updateVis(argument){
        var vis = this;
        // Update domain
        // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
        vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
        ]);
        // console.log(vis.displayData)
        var dataCategories = vis.categories;
        var selection= "#" + vis.parent+'_selection';
        // Draw the layers
        var categories = vis.svg.selectAll(".area")
            .data(vis.displayData);

        categories.enter().append("path")
            .attr("class", "area")
            .merge(categories)
            .style("fill", function(d,i) {
                return vis.colorScale(dataCategories[i]);
            })
            .attr("d", function(d) {
                return vis.area(d);
            })
            .on("mouseover", function(d,i){
                var selection_text=dataCategories[i];
                if (dataCategories[i]=="graduate_enroll"){
                    selection_text="Graduate Student Enrollment";
                }
                else if(dataCategories[i]=="undergrad_enroll"){
                    selection_text="Undergraduate Student Enrollment";
                }
                else if(dataCategories[i]=="freshM"){
                    selection_text="Freshmen Males";
                }
                else if(dataCategories[i]=="freshF"){
                    selection_text="Freshmen Females";
                }
                else if(dataCategories[i]=="sophM"){
                    selection_text="Sophomore Males";
                }
                else if(dataCategories[i]=="sophF"){
                    selection_text="Sophomore Females";
                }
                else if(dataCategories[i]=="juM"){
                    selection_text="Junior Males";
                }
                else if(dataCategories[i]=="juF"){
                    selection_text="Junior Females";
                }
                else if(dataCategories[i]=="senM"){
                    selection_text="Senior Males";
                }
                else if(dataCategories[i]=="senF"){
                    selection_text="Senior Females";
                }


                $( selection ).html("Selection: "+selection_text);
                return;
            } );
            // .on("mouseout", function(d){
            //     $( selection ).html("Selection:");
            //     return;
            // } );
        categories.exit().remove();


        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    onSelectionChange(selectionStart, selectionEnd){
        var vis = this;


        vis.temp_data=vis.data.filter(function(d){
            if (d.date >= selectionStart && d.date<=selectionEnd){
                return true;
            }
            else{
                return false;
            }
        });

        var dataCategories = vis.categories;
        var stack=d3.stack().keys(dataCategories);
        var stackedData = stack(vis.temp_data);
        vis.displayData =stackedData;

        vis.x.domain(d3.extent(vis.temp_data, function(d) { return d.date; }));
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);
        vis.updateVis();

    }





}



