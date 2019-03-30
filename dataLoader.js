loadData();


function loadData() {

    d3.csv("data/data_2018.csv", function (error, data) {
        var wrangle= new Wrangle(data)
    });
}


