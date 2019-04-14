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
    document.querySelector('#message').innerHTML = 'Select a school to get started';
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

    // parse year data
    let dates = years.map(function(d) {
      return parse_time(d);
    });

    // create event handler
    var event_handler = {};

    // create year chart for brushing
    let year_chart = new YearChart('year_chart', dates, event_handler);

    // create tuition line chart
    let tuition_line = new Line('tuition_line', tuition_data);

    // create enrollment stacked area chart
    let enrollment_chart = new StackedArea('enroll_area', enroll_data, ['graduate_enroll', 'undergrad_enroll']);

    // bind brush event to event handler
    $(event_handler).bind("selectionChanged", function(event, selectionStart, selectionEnd) {
      enrollment_chart.onSelectionChange(selectionStart, selectionEnd);
      tuition_line.onSelectionChange(selectionStart, selectionEnd);
    });

    // make profile content visible
    document.querySelector('#profiles #content').style.display = 'block';
  }
}