function load_data() {
  let q = queue();
  let data = {};
  let years = create_years(1999,2018);

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
    this.schools=schools;
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
  return data.map(function(d,i) {
    let entry = {
      'name': d.name,
      'type': d.type,
      'index': i,
      'undergrad_enroll': +d.undergrad_enroll,
      'graduate_enroll': +d.graduate_enroll,
      'description': d.description,
      'freshmen_enroll_table': parse_table(d.freshmen_enroll_table),
      'sophomore_enroll_table': parse_table(d.sophomore_enroll_table),
      'junior_enroll_table': parse_table(d.junior_enroll_table),
      'senior_enroll_table': parse_table(d.senior_enroll_table),
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
  console.log(data);
  let profile = new Profile('profiles', data);
  let trends = new Trends('trends', data);
  let cluster = new Cluster('cluster', data);

  //let enrollment = new Histogram('test', data);
}
//Search tool functions
function callSearch(){
  search(this.schools)
}
function search(school_list){
  //Clear old highlights
  d3.select("#cluster")
      .select("g")
      .selectAll("circle")
      .style("stroke-width",0)


  //source:https://www.w3schools.com/howto/howto_js_filter_lists.asp
  var input, filter,txtValue;
  input = document.getElementById('search');
  filter = input.value.toUpperCase();
  var selected_schools=[]
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < school_list.length; i++) {
      txtValue = school_list[i];;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        selected_schools.push(school_list[i])
      }
  }

  //Highlight selected schools
  if(selected_schools.length<school_list.length/3){
    console.log(selected_schools.length)
    for (i=0; i<selected_schools.length;i++){
      var current_school="#"+selected_schools[i];
      current_school=current_school.split(' ').join('');
      current_school=current_school.split('.').join('');
      current_school=current_school.split('-').join('');
      current_school=current_school.split(',').join('');
      current_school=current_school.split("'").join('');
      console.log(current_school, i)
      var radius=d3.select("#cluster")
          .select("g")
          .select(current_school)
          .attr("r");

        d3.select("#cluster")
            .select("g")
            .select(current_school)
            .attr("stroke", "black")
            .style("stroke-width", function(d){return radius/3});
    }
  }




}


load_data();