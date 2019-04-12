//Source studio 6

class YearChart {
    constructor(_parent, _data, MyEventHandler) {
        this.parent = _parent;
        this.data = _data;
        this.eventHandler = MyEventHandler;
        this.init();
    }

    init(argument) {
        var vis = this;

        // initialize plot
        vis.margin = {top: 30, right: 30, bottom: 30, left: 60};
        vis.width = window.innerWidth/2.2 - vis.margin.left - vis.margin.right;
        vis.height = 100 - vis.margin.top - vis.margin.bottom;

        // set data
        let data =vis.data;

        var max_enroll=0;

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
            .domain([data[0], data[data.length-1]]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        //Draw the rectangle
        vis.svg.append("g").append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("fill","#d6d4d3")

        // initalizing brush component
        var brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", brushed);

        function brushed() {
            // // Set new domain if brush (user selection) is not empty
            // ug_g_enrollment_chart.x.domain(
            //     d3.event.selection === null ?  vis.x .domain() : d3.event.selection.map(vis.x .invert)
            // );
            // // Update focus chart (detailed information)
            // //console.log();
            // ug_g_enrollment_chart.updateVis();
            if(d3.event.selection == null) {
                // No region selected (brush inactive)
                $(vis.eventHandler).trigger("x", vis.x.domain());
            } else {
                // User selected specific region
                $(vis.eventHandler).trigger("selectionChanged", d3.event.selection.map(vis.x.invert));
            }
            // vis.wrangleData();
        }
        //Append brush component
        vis.svg.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", vis.height + 7);

        //Set the X axis
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);


        // vis.svg.append("defs").append("clipPath")
        //     .attr("id", "clip")
        //     .append("rect")
        //     .attr("width", vis.width)
        //     .attr("height", vis.height);








        // vis.updateVis();
    }

}