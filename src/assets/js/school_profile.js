class Profile {
  constructor(parent, data) {
    this.parent = parent;
    this.data = data;
    this.init();
  }

  init() {
    let self = this;

    // get html selections
    let select = document.querySelector('#selection');
    let year_select = document.querySelector('#year_selection');

    // initialize data
    let years = create_years(1999,2018);
    let schools = self.data['2018'].map(function(d) { return d.name; });

    // initialize dropdown menu
    for (let k=0; k<schools.length; k++) {
      select.options[select.options.length] = new Option(schools[k], k);
    }

    // initialize dropdown event listener
    $('#selection').change(function() {
      self.load_profile(select.value);
    });

    // update message, data done loading
    document.querySelector('#message').innerHTML = "";
  }

  load_profile(school_idx) {
    let self = this;
    // initialize school attributes
    let name = self.data['2018'][school_idx].name;
    let description = self.data['2018'][school_idx].description;

    // set html text
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

    // get enrollment data for grad and under grad over the years;
    let enroll_data = years.map(function(d) {
      return {
        'date': parse_time(d),
        'graduate_enroll': self.data[d][school_idx].graduate_enroll,
        'undergrad_enroll': self.data[d][school_idx].undergrad_enroll
      }
    });

    // get enrollment by gender data
    let gender_data = years.map(function(d) {
      var freshM=0;
      var freshF=0;
      var sophM=0;
      var sophF=0;
      var juM=0;
      var juF=0;
      var senM=0;
      var senF=0;
      if (self.data[d][school_idx].freshmen_enroll_table !="none"){
        freshM=self.data[d][school_idx].freshmen_enroll_table.gender.male;
        freshF=self.data[d][school_idx].freshmen_enroll_table.gender.female;
      }
      if (self.data[d][school_idx].sophomore_enroll_table !="none"){
        sophM=self.data[d][school_idx].sophomore_enroll_table.gender.male;
        sophF=self.data[d][school_idx].sophomore_enroll_table.gender.female;
      }
      if (self.data[d][school_idx].junior_enroll_table !="none"){
        juM=self.data[d][school_idx].junior_enroll_table.gender.male;
        juF=self.data[d][school_idx].junior_enroll_table.gender.female;
      }
      if (self.data[d][school_idx].senior_enroll_table !="none"){
        senM=self.data[d][school_idx].senior_enroll_table.gender.male;
        senF=self.data[d][school_idx].senior_enroll_table.gender.female;
      }

      return {
        'date': parse_time(d),
        'freshM': freshM,
        'freshF': freshF,
        'sophM': sophM,
        'sophF': sophF,
        'juM': juM,
        'juF': juF,
        'senM': senM,
        'senF': senF
      }
    });

    // get ethnicity by ethnicity data
    let ethnicity_data = years.map(function(d) {
      var asian=0;
      var black=0;
      var hispanic=0;
      var native_american=0;
      var other=0;
      var white=0;

      if (self.data[d][school_idx].freshmen_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].freshmen_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].freshmen_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].freshmen_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].freshmen_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].freshmen_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].freshmen_enroll_table.ethnicity.white;
      }
      if (self.data[d][school_idx].sophomore_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].sophomore_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].sophomore_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].sophomore_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].sophomore_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].sophomore_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].sophomore_enroll_table.ethnicity.white;
      }
      if (self.data[d][school_idx].junior_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].junior_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].junior_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].junior_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].junior_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].junior_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].junior_enroll_table.ethnicity.white;
      }
      if (self.data[d][school_idx].senior_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].senior_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].senior_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].senior_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].senior_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].senior_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].senior_enroll_table.ethnicity.white;
      }

      return {
        'date': parse_time(d),
        'asian': asian,
        'black': black,
        'hispanic': hispanic,
        'native_american': native_american,
        'other': other,
        'white': white
      }
    });

    // parse year data
    let dates = years.map(function(d) {
      return parse_time(d);
    });

    // create event handler
    var event_handler = {};

    // create year chart for brushing
    let year_chart = new YearChart('year_chart', dates, event_handler);

    // create tuition line chart
    let tuition_chart = new Line('tuition_line', tuition_data, tuition_data, 1);

    // create enrollment stacked area chart
    let enrollment_chart = new StackedArea('enroll_area', enroll_data, ['graduate_enroll', 'undergrad_enroll']);

    //Create enrollment by gender area chart
    let gender_chart = new StackedArea('Gender_chart', gender_data, ['freshM', 'freshF','sophM','sophF','juM','juF','senM','senF']);

    //Create enrollment by ethnicity area chart
    let ethnicity_chart = new StackedArea('Ethnicity_chart', ethnicity_data, ['asian', 'black','hispanic','native_american','other','white']);

    // bind brush event to event handler
    $(event_handler).bind("selectionChanged", function(event, selectionStart, selectionEnd) {
      enrollment_chart.onSelectionChange(selectionStart, selectionEnd);
      tuition_chart.onSelectionChange(selectionStart, selectionEnd)
      gender_chart.onSelectionChange(selectionStart, selectionEnd)
      ethnicity_chart.onSelectionChange(selectionStart, selectionEnd)
    });

    // make profile content visible
    document.querySelector('#profiles #content').style.display = 'block';
  }
}