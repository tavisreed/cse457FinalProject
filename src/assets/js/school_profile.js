//monitor drop down
/*d3.select("#dropDown").on("change", function(){
  var selection=d3.select("#selection").property("value");
  console.log(selection)
  var school_data=[]
  var data=self.data;

    for (var k=1999; k<2018;k++) {
      for (var j=0; j<data[k].length;j++){
        if (j==selection){
          school_data.push(data[k][j])
        }
      }
    }
});*/

class Profile {
  constructor(parent, data) {
    this.parent = parent;
    this.data = data;
    this.init();
  }

  init() {
    let self = this;

    // initialize dropdown menu
    let select = document.querySelector('#selection');
    let schools = self.data['2018'].map(function(d) { return d.name; })
    for (let k=0; k<schools.length; k++)  {
      select.options[select.options.length] = new Option(schools[k], k);
    }

    // initialize dropdown event listener
    document.querySelector('#dropdown').addEventListener('change', function() {
      let school_idx = select.value;
      self.load_profile(school_idx);
    });
  }

  load_profile(school_idx) {
    let self = this;
    document.querySelector('#profiles #name').innerHTML = self.data['2018'][school_idx].name;
  }
}