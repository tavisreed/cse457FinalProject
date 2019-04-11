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
    let year_select = document.querySelector('#year_selection');
    let years = create_years(1999,2018);
    let schools = self.data['2018'].map(function(d) { return d.name; });

    for (let k=0; k<schools.length; k++) {
      select.options[select.options.length] = new Option(schools[k], k);
    }

    for (let p=0; p<years.length; p++) {
      year_select.options[year_select.options.length] = new Option(years[p], p);
    }

    // initialize dropdown event listener
    select.addEventListener('change', function() {
      let school_idx = select.value;
      let year_idx = year_select.value;
      self.load_profile(school_idx, year_idx);
    });

    year_select.addEventListener('change', function() {
      let school_idx = select.value;
      let year_idx = year_select.value;
      self.load_profile(school_idx, year_idx);
    });

    // update message, data done loading
    document.querySelector('#message').innerHTML = 'Select a school to get started';
  }

  load_profile(school_idx, year_idx) {
    let self = this;
    let name = self.data['2018'][school_idx].name;
    let description = self.data['2018'][school_idx].description;

    document.querySelector('#profiles #name').innerHTML = name;
    document.querySelector('#profiles #description').innerHTML = description;

    // parse data for line charts
    let parse_time = d3.timeParse("%Y");
    let years = create_years(1999,2018);

    // get tuition data over years
    let tuition_data = years.map(function(d) {
      return {
        'date': parse_time(d),
        'value': self.data[d][school_idx].tuition[0]
      }
    });

    // get enrollment data over years
    let enroll_data = years.map(function(d) {
      return {
        'date': parse_time(d),
        'value': self.data[d][school_idx].undergrad_enroll
      }
    });

    //Get enrollment data for grad and under grad over the years;
    // get enrollment data over years
    let ug_g_enroll_data = years.map(function(d) {
      return {
        'date': parse_time(d),
        'graduate_enroll': self.data[d][school_idx].graduate_enroll,
        'undergrad_enroll': self.data[d][school_idx].undergrad_enroll
      }
    });

    // create tuition line charts
    let tuition_line = new Line('tuition_line', tuition_data);
    let enroll_line = new Line('enroll_line', enroll_data);

    // create stacked Area charts
    let ug_g_enrollment_chart = new Sarea('GvU_chart', ug_g_enroll_data, ['graduate_enroll','undergrad_enroll'] );

    // create Year chart for brushing
    var dates=[];
    for (let i=0; i<enroll_data.length; i++) {
      dates.push(enroll_data[i].date);
    }
    let year_chart= new YearChart('Year_chart', dates);

    // make profile content visible
    document.querySelector('#profiles #content').style.display = 'block';
  }
}