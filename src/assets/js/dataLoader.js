
queue()
    .defer(d3.csv, "data/data_2018.csv")
    .defer(d3.csv, "data/data_2017.csv")
    .defer(d3.csv, "data/data_2016.csv")
    .await(loadData);

function loadData(error, data1, data2, data3) {
    var load_2018= new Wrangle(data1)
    console.log(load_2018.processData)
    var load_2017= new Wrangle(data2)
    console.log(load_2017.processData)
    var load_2016= new Wrangle(data3)
    console.log(load_2016.processData)
}
