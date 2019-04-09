// Source: https://bl.ocks.org/lorenzopub/0b09968e3d4970d845a5f45ed25595bb

class Sarea {
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
        let data =self.data;
        console.log(data);

        var max_enroll=0;

        for (var i=0;i<data.length;i++){
            var combined=data[i].graduate_enroll+data[i].undergrad_enroll;
            if (combined>max_enroll){
                max_enroll=combined;
            }
        }

        var svg = d3.select('#' + self.parent).html('')
            .attr("width", self.width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom);

        var g=svg.append("g").attr("transform", "translate(" + self.width/2 + "," + self.height/2 + ")");

        var x_scale=d3.scaleTime()
            .range([0, self.width*.95])
            .domain([data[0].date.getYear,data[data.length-1].date.getYear]);

        var y_scale=d3.scaleLinear()
            .range([self.height,0])
            .domain([0,max_enroll])

        var color_scale=d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
            .domain([0,2]);

        var xAxis = d3.axisBottom()
            .scale(x_scale);

        var yAxis = d3.axisLeft()
            .scale(y_scale);

        var area = d3.area()
            .x(function(d) {
                return x(d.data.date); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); });
    }
}