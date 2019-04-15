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
  this.data=data;
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
function compSearch(number){
    var self=this;
    var school_list=this.schools;
    var comparision_id="school_"+number;
    var indexes=[];
    //source:https://www.w3schools.com/howto/howto_js_filter_lists.asp
    var input, filter,txtValue;
    input = document.getElementById(comparision_id);
    console.log(input);
    filter = input.value.toUpperCase();
    var selected_schools=[];
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < school_list.length; i++) {
      txtValue = school_list[i];
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        selected_schools.push(school_list[i]);
        indexes.push(i);
      }
    }
    console.log(self.data[2018][indexes[0]])
    //Set the school name
    var name_id="#school_name_"+number;
    document.querySelector(name_id).innerHTML =selected_schools[0];
    var type_id="#type_"+number;
    document.querySelector(type_id).innerHTML ="Type of Institution: "+self.data[2018][indexes[0]].type;
    var tuition_id="#tuition_"+number;
    //Get tuition
    var tuition=self.data[2018][indexes[0]].tuition;
    if (typeof tuition != "number"){
        tuition="Data Not Avaliable";
    }
    document.querySelector(tuition_id).innerHTML ="Tuition: "+tuition;
    //Get Enrollment numbers
    var grad=self.data[2018][indexes[0]].graduate_enroll;
    var ungrad=self.data[2018][indexes[0]].undergrad_enroll;
    if (typeof grad != "number"){
        grad="Data Not Avaliable";
    }
    if (typeof ungrad != "number"){
        ungrad="Data Not Avaliable";
    }
    var total=0;
    if (typeof grad=="number" && typeof ungrad=="number"){
        total=grad+ungrad;
    }
    else if (typeof grad !="number"){
        total=ungrad;
    }
    else if (typeof ungrad !="number"){
        total=grad;
    }
    else{
        total="Data Not Avaliable";
    }

    var per_grad=((grad/total)*100).toFixed(2)+"%";
    var per_ungrad=((ungrad/total)*100).toFixed(2)+"%";

    if(total==0 || typeof total!="number"){
        per_grad="Data Not Avaliable";
        per_ungrad="Data Not Avaliable";
    }

    var students_id="#students_numbers_"+number;
    document.querySelector(students_id).innerHTML ="Total Number of Students: "+ total;
    var grad_id="#grad_numbers_"+number;
    document.querySelector(grad_id).innerHTML ="Percent of Graduate Students: "+ per_grad;
    var ungrad_id="#under_numbers_"+number;
    document.querySelector(ungrad_id).innerHTML ="Percent of Undergraduate Students:"+per_ungrad;
    var male=0;
    var female=0;
    //Get enrollment by gender numbers
    if (self.data[2018][indexes[0]].freshmen_enroll_table !="none"){
        male=male+self.data[2018][indexes[0]].freshmen_enroll_table.gender.male;
        female=female+self.data[2018][indexes[0]].freshmen_enroll_table.gender.female;
    }
    if (self.data[2018][indexes[0]].sophomore_enroll_table !="none"){
        male=male+self.data[2018][indexes[0]].sophomore_enroll_table.gender.male;
        female=female+self.data[2018][indexes[0]].sophomore_enroll_table.gender.female;
    }
    if (self.data[2018][indexes[0]].junior_enroll_table !="none"){
        male=male+self.data[2018][indexes[0]].junior_enroll_table.gender.male;
        female=female+self.data[2018][indexes[0]].junior_enroll_table.gender.female;
    }
    if (self.data[2018][indexes[0]].senior_enroll_table !="none"){
        male=male+self.data[2018][indexes[0]].senior_enroll_table.gender.male;
        female=female+self.data[2018][indexes[0]].senior_enroll_table.gender.female;
    }
    var per_male=(male/(male+female)*100).toFixed(2)+"%";
    var per_female=(female/(male+female)*100).toFixed(2)+"%";
    if(male+female==0 || typeof (male+female)!="number"){
        per_male="Data Not Avaliable";
        per_female="Data Not Avaliable";
    }

    var male_id="#percent_male_"+number;
    document.querySelector(male_id).innerHTML ="Percent of Male Students: "+per_male ;
    var female_id="#percent_female_"+number;
    document.querySelector(female_id).innerHTML ="Percent of Female Students: "+ per_female;

    //Get enrollment by Ethnicity
    var asian=0;
    var black=0;
    var hispanic=0;
    var native_american=0;
    var other=0;
    var white=0;
    if (self.data[2018][indexes[0]].freshmen_enroll_table !="none"){
        asian=asian+self.data[2018][indexes[0]].freshmen_enroll_table.ethnicity.asian;
        black=black+self.data[2018][indexes[0]].freshmen_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[2018][indexes[0]].freshmen_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[2018][indexes[0]].freshmen_enroll_table.ethnicity["native-american"];
        other=other+self.data[2018][indexes[0]].freshmen_enroll_table.ethnicity.other;
        white=white+self.data[2018][indexes[0]].freshmen_enroll_table.ethnicity.white;
    }
    if (self.data[2018][indexes[0]].sophomore_enroll_table !="none"){
        asian=asian+self.data[2018][indexes[0]].sophomore_enroll_table.ethnicity.asian;
        black=black+self.data[2018][indexes[0]].sophomore_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[2018][indexes[0]].sophomore_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[2018][indexes[0]].sophomore_enroll_table.ethnicity["native-american"];
        other=other+self.data[2018][indexes[0]].sophomore_enroll_table.ethnicity.other;
        white=white+self.data[2018][indexes[0]].sophomore_enroll_table.ethnicity.white;
    }
    if (self.data[2018][indexes[0]].junior_enroll_table !="none"){
        asian=asian+self.data[2018][indexes[0]].junior_enroll_table.ethnicity.asian;
        black=black+self.data[2018][indexes[0]].junior_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[2018][indexes[0]].junior_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[2018][indexes[0]].junior_enroll_table.ethnicity["native-american"];
        other=other+self.data[2018][indexes[0]].junior_enroll_table.ethnicity.other;
        white=white+self.data[2018][indexes[0]].junior_enroll_table.ethnicity.white;
    }
    if (self.data[2018][indexes[0]].senior_enroll_table !="none"){
        asian=asian+self.data[2018][indexes[0]].senior_enroll_table.ethnicity.asian;
        black=black+self.data[2018][indexes[0]].senior_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[2018][indexes[0]].senior_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[2018][indexes[0]].senior_enroll_table.ethnicity["native-american"];
        other=other+self.data[2018][indexes[0]].senior_enroll_table.ethnicity.other;
        white=white+self.data[2018][indexes[0]].senior_enroll_table.ethnicity.white;
    }
    var total_eth=asian+black+hispanic+native_american+other+white;

    var per_asian=(asian/(total_eth)*100).toFixed(2)+"%";
    var per_black= (black/(total_eth)*100).toFixed(2)+"%";
    var per_hispanic=(hispanic/(total_eth)*100).toFixed(2)+"%";
    var per_native=(native_american/(total_eth)*100).toFixed(2)+"%";
    var per_other=(other/(total_eth)*100).toFixed(2)+"%";
    var per_white=(white/(total_eth)*100).toFixed(2)+"%";

    if(total_eth==0 || typeof total_eth!="number"){
        per_asian="Data Not Avaliable";
        per_black="Data Not Avaliable";
        per_hispanic="Data Not Avaliable";
        per_native="Data Not Avaliable";
        per_other="Data Not Avaliable";
        per_white="Data Not Avaliable";
    }
    var asian_id="#percent_asian_"+number;
    document.querySelector(asian_id).innerHTML ="Percent of Asian Students: "+per_asian ;
    var black_id="#percent_black_"+number;
    document.querySelector(black_id).innerHTML ="Percent of Black Students: "+per_black;
    var hispanic_id="#percent_hispanic_"+number;
    document.querySelector(hispanic_id).innerHTML ="Percent of Hispanic Students: "+ per_hispanic;
    var other_id="#percent_other_"+number;
    document.querySelector(other_id).innerHTML ="Percent of Other Students: "+ per_other;
    var white_id="#percent_white_"+number;
    document.querySelector(white_id).innerHTML ="Percent of White Students: "+ per_white;
    var native_id="#percent_native_"+number;
    document.querySelector(native_id).innerHTML ="Percent of Native American Students: "+ per_native;

}


load_data();