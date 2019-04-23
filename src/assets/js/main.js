let cluster;

// data loading/prep sequence
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
    // initial parsing
    file_data.forEach(function(d,i) {
      data[years[i]] = parse_data(d);
    });

    // strip all schools without 2018 data
    data[2018] = year_filter(data[2018]);

    // synchronize schools across years
    data = synchronize(data);

    this.data = data;

    // start visualizations
    start(data);
  });
}

function start(data) {
  console.log(data);

  // create main visualization objects
  let profile = new Profile('profiles', data);
  let trends = new Trends('trends', data);
  cluster = new Cluster('cluster', data);

  // prep modal for start
  document.querySelector('#dismiss-modal').style.display = 'block';
  document.querySelector('#loading-modal').style.display = 'none';
  document.querySelector('.spinner').style.display = 'none';

  invis_start("svg_school_level_1");
  invis_start("svg_school_gen_1");
  invis_start("svg_school_eth_1");

  invis_start("svg_school_level_2");
  invis_start("svg_school_gen_2");
  invis_start("svg_school_eth_2");

  // set school names
  let schools = data['2018'].map(function(d) { return d.name; });
  this.schools = schools;

  // set main search autocomplete
  $(function () {
      $("#search").autocomplete({
          source: schools,
          maxShowItems: 10
      });

      $("#search_profiles").autocomplete({
          source: schools,
          maxShowItems: 10
      });

      $("#school_1").autocomplete({
          source: schools,
          maxShowItems: 10
      });

      $("#school_2").autocomplete({
          source: schools,
          maxShowItems: 10
      });
  });

  // on search click
  document.querySelector('#search_btn').addEventListener('click', function() {
    if (this.innerHTML == 'Clear') {
      document.querySelector('#search').value = '';
      cluster.g.selectAll('circle').data().forEach(function(d) {
        d.selected = false;
      });
      this.innerHTML = 'Search';
      return;
    }


    // get search bar text
    let search_text = document.querySelector('#search').value.toLowerCase();

    // highlight all nodes matching search
    schools.filter(function(d) {
      return d.toLowerCase().includes(search_text);
    }).forEach(function(d) {
      let school = d.replace(/[ &.\-,']/g,'');
      let node = d3.select('#'+school);
      node.datum().selected = true;
    });

    // set button to clear search
    this.innerHTML = 'Clear';
  });

  //Search Button for School Profile Page
    document.querySelector('#search_profiles_btn').addEventListener('click', function() {
         // get search bar text
        let search_text = document.querySelector('#search_profiles').value.toLowerCase();

        schools.forEach(function(d,i){
            if (d.toLowerCase()==search_text){
                $('#selection').val(i).trigger('change');
            }
        });


    });

  // cluster listeners
  let mode_options = {
    'schools': [
      {'text': 'By school (default)', 'value': 'school'}, 
      {'text': 'By public vs. private', 'value': 'school_type'},
      {'text': 'By tuition', 'value': 'tuition'}
    ],
    'students': [
      {'text': 'By gender & ethnicity (default)', 'value': 'both'}, 
      {'text': 'By gender', 'value': 'gender'},
      {'text': 'By ethnicity', 'value': 'ethnicity'}
    ]
  }

  // get cluster selection
  let cluster_select = document.querySelector('#cluster-selection');

  // mode button listener
  $("input[name='modes']").on('change', function() {
    cluster.change_mode(this.id);

    // change selection based on mode
    for (opt in cluster_select.options) { cluster_select.options.remove(0); }
    mode_options[this.id].forEach(function(d,i) {
      cluster_select[i] = new Option(d.text, d.value);
    });
  });

  // update cluster group listener
  cluster_select.addEventListener('change', function() {
    cluster.update(cluster_select.value);
  });
}

function compSearch(number) {
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

    //Set the school name
    var name_id=".school_name_"+number;
    document.querySelectorAll(name_id).innerHTML =selected_schools[0];
    var temp= document.querySelectorAll(name_id);
    temp.forEach(function(d){
        d.innerHTML=selected_schools[0];
    })

    var type_id="#type_"+number;
    document.querySelector(type_id).innerHTML ="Type of Institution: "+self.data[2018][indexes[0]].type;
    var tuition_id="#tuition_"+number;
    //Get tuition
    var tuition=self.data[2018][indexes[0]].tuition[0];
    if (typeof tuition != "number"){
        tuition="Data Not Avaliable";
    }
    else{
        tuition="$"+tuition;
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

    var per_grad=((grad/total)*100).toFixed(2);
    var per_ungrad=100-parseInt(per_grad);

    // if(total==0 || typeof total!="number"){
    //     per_grad="Data Not Avaliable";
    //     per_ungrad="Data Not Avaliable";
    // }


    var parent="svg_school_level_"+number;
    if(total && typeof total=="number"){
        let stackedBar_gen = new StackedBar(parent, [parseInt(per_grad),parseInt(per_ungrad)], ['Graduate Students','Undergraduate Students'],2);
    }
    var enroll_id="#total_enroll_"+number;
    document.querySelector(enroll_id).innerHTML = "Total Enrollment: " + total;

    //Get enrollment by gender numbers
    var male=0;
    var female=0;
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
    var per_male=(male/(male+female)*100).toFixed(2);
    //var per_female=(female/(male+female)*100).toFixed(2);
    var per_female = 100-parseInt(per_male);
    // if(male+female==0 || typeof (male+female)!="number"){
    //     per_male="Data Not Avaliable";
    //     per_female="Data Not Avaliable";
    // }
    var parent="svg_school_gen_"+number;
    if(male+female!=0 && typeof (male+female)=="number"){
        let stackedBar_gen = new StackedBar(parent, [parseInt(per_male),parseInt(per_female)], ['Male','Female'],2);
    }


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

    var per_asian=(asian/(total_eth)*100).toFixed(2);
    var per_black= (black/(total_eth)*100).toFixed(2);
    var per_hispanic=(hispanic/(total_eth)*100).toFixed(2);
    var per_native=(native_american/(total_eth)*100).toFixed(2);
    var per_other=(other/(total_eth)*100).toFixed(2);
    var per_white=100-(parseInt(per_asian)+parseInt(per_black)+parseInt(per_hispanic)+parseInt(per_native)+parseInt(per_other));

        if(total_eth==0 || typeof total_eth!="number"){
        per_asian="Data Not Avaliable";
        per_black="Data Not Avaliable";
        per_hispanic="Data Not Avaliable";
        per_native="Data Not Avaliable";
        per_other="Data Not Avaliable";
        per_white="Data Not Avaliable";
    }

    var parent="svg_school_eth_"+number;
    if(total_eth!=0 && typeof total_eth==="number"){
        let stackedBar_eth = new StackedBar(parent, [parseInt(per_asian),parseInt(per_black),parseInt(per_hispanic),parseInt(per_native),parseInt(per_other),parseInt(per_white)], ['Asian','Black','Hispanic','Native American','Other', 'White'],6);
    }
}

//Start with invisible placeholder bars
function invis_start(parent_name){
    var margin = {top: 30, right: 30, bottom: 30, left: 60};
    var width = window.innerWidth/2.2 - margin.left - margin.right;
    var height = 100 - margin.top -margin.bottom;

    var svg = d3.select('#' + parent_name).html('')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("rect")
        .attr("fill", "white")
        .attr("height", height)
        .attr("width", width)
        .attr("y", 0)
        .attr("x", 0);
}

// toggle modal
$('#initial-modal').modal('toggle');

// start app
load_data();
