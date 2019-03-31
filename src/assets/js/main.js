loadData();

function loadData() {
    d3.json("assets/data/2018data.json", function (error, data) {
      console.log(data);
      var wrangle = new Wrangle(data);
    });
}
