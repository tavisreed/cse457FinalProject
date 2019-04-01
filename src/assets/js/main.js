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
    console.log(data);

  });

  // start visualizations
  //start(data);
}

function parse_data(data) {
  return data.map(function(d) {
    return {
      'undergrad_enroll': +d.undergrad_enroll,
      'graduate_enroll': +d.graduate_enroll
    }
  });
}

function start(data) {
  let enrollment = new Historgram('enrollment', data);
}

load_data();
