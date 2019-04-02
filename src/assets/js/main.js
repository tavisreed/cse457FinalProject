function load_data() {
  let q = queue();
  let data = {};
  let years = [];

  for (let i=1999; i<2019; i++) {
    years.push(i)
  }

  // queue all year files
  years.forEach(function(d) {
    q.defer(d3.json, 'assets/data/'+d+'data.json')
  });

  // await all loading files
  q.awaitAll(function(error, file_data) {
    // synchronize schools across years
    let schools = file_data.reduce(function(a,b) {
      let a_names = a.map(function(d) { return d.name; });
      let b_names = b.map(function(d) { return d.name; });
      let intersection = a_names.filter(function(d) {
        return b_names.includes(d);
      });
      return intersection.map(function(d) {
        return { 'name': d };
      });
    });

    // unwrap schools
    schools = schools.map(function(d) { return d.name; });

    file_data.forEach(function(d,i) {
      let slice = d.filter(function(e) {
        return schools.includes(e.name);
      });
      data[years[i]] = parse_data(slice);
    });

    // start visualizations
    start(data);
  });
}

function parse_data(data) {
  return data.map(function(d) {
    let entry = {
      'name': d.name,
      'type': d.type,
      'undergrad_enroll': +d.undergrad_enroll,
      'graduate_enroll': +d.graduate_enroll,
      'description': d.description,
      'freshmen_enroll_table': 'none',
      'sophomore_enroll_table': 'none',
      'junior_enroll_table': 'none',
      'senior_enroll_table': 'none',
      'teaching_tenure_table': 'none',
      'tuition': parse_tuition(d.tuition),
      'sat_scores': 'none',
      'act_scores': 'none',
      'degree_table': 'none',
    }

    return entry;
  });
}

function start(data) {
  let profile = new Profile('profiles', data);
  let enrollment = new Histogram('test', data);
}

load_data();