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
    let name = self.data['2018'][school_idx].name;
    let description = self.data['2018'][school_idx].description;

    document.querySelector('#profiles #name').innerHTML = name;
    document.querySelector('#profiles #description').innerHTML = description;
  }
}