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
    let year_select=document.querySelector('#year_selection')
    let years= [1999,2000,2001,2002,2003,
      2004,2005,2006,2007,2008,2009,2010,
      2011,2012,2013,2014,2015,2016,2017,2018];
    let schools = self.data['2018'].map(function(d) { return d.name; })
    for (let k=0; k<schools.length; k++) {
      select.options[select.options.length] = new Option(schools[k], k);
    }
    for (let p=0; p<years.length; p++) {
      year_select.options[year_select.options.length] = new Option(years[p], p);
    }

    // initialize dropdown event listener
    select.addEventListener('change', function() {
      let school_idx = select.value;
      let year_idx=year_select.value;
      self.load_profile(school_idx, year_idx);
    });

    year_select.addEventListener('change', function() {
      let school_idx = select.value;
      let year_idx=year_select.value;
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

    var pie_data=[]
    var year= parseInt(year_idx)+1999
    var current_year=self.data[year];
    for (var i=0; i<current_year.length;i++){
      if (school_idx==i){
        pie_data=current_year[i];
      }
    }



    // create tuition line charts
    let tuition_line = new Line('tuition_line', tuition_data);
    let enroll_line = new Line('enroll_line', enroll_data);

    // create Pie chart
    if(pie_data.graduate_enroll!=0 || pie_data.undergrad_enroll!=0 ){
      let pie_chart=new Pie('GvU_chart', pie_data);
    }
    // make profile content visible
    document.querySelector('#profiles #content').style.display = 'block';
  }
}