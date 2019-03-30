loadData();

function loadData() {
    d3.csv("assets/data/data_2018.csv", function (error, data) {
      console.log(data);
        var wrangle = new Wrangle(data);
    });
}
