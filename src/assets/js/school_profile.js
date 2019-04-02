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
    for (let k=0; k<schools.length; k++) {
      select.options[select.options.length] = new Option(schools[k], k);
    }

    // initialize dropdown event listener
    select.addEventListener('change', function() {
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

    // parse data for line charts
    let parse_time = d3.timeParse("%Y");
    let years = create_years(1999,2018);

    let tuition_data = years.map(function(d) {
      return {
        'date': parse_time(d),
        'value': self.data[d][school_idx].tuition[0]
      }
    });

    let enroll_data = years.map(function(d) {
      return {
        'date': parse_time(d),
        'value': self.data[d][school_idx].undergrad_enroll
      }
    });

    // create tuition line charts
    let tuition_line = new Line('tuition_line', tuition_data);
    let enroll_line = new Line('enroll_line', enroll_data);

    // make profile content visible
    document.querySelector('#profiles #content').style.display = 'block';
  }
}