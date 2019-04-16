function load_data() {
  let q = queue();
  let data = {};
  let years = create_years(1999,2018);

  // queue all year files
  years.forEach(function(d) {
    q.defer(d3.json, 'assets/data/datanew/'+d+'data.json')
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

    this.schools = data['2017'].map(function(d) { return d.name; });;

    // start visualizations
    start(data);
  });
}

function start(data) {
  document.querySelector('#dismiss-modal').style.display = 'block';
  document.querySelector('#loading-modal').style.display = 'none';
  document.querySelector('.spinner').style.display = 'none';

  invis_start("svg_school_level_1");
  invis_start("svg_school_gen_1");
  invis_start("svg_school_eth_1");

  invis_start("svg_school_level_2");
  invis_start("svg_school_gen_2");
  invis_start("svg_school_eth_2");

  console.log(data);

  let profile = new Profile('profiles', data);
  let trends = new Trends('trends', data);
  let cluster = new Cluster('cluster', data);
  this.data=data;

  autocomplete(document.getElementById("search"), this.schools);
  autocomplete(document.getElementById("school_1"), this.schools);
  autocomplete(document.getElementById("school_2"), this.schools);
  //autocomplete(document.getElementById("school_3"), this.schools);
  //let enrollment = new Histogram('test', data);

  let cluster_select = document.querySelector('#cluster-selection');
  cluster_select.addEventListener('change', function() {
    cluster.update(cluster_select.value);
  });

}

//autocomplete form from https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
  
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
     
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
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
          .select("#clusterG")
          .select(current_school)
          .attr("r");

        d3.select("#cluster")
            .select("#clusterG")
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
    var per_ungrad=((ungrad/total)*100).toFixed(2);

    // if(total==0 || typeof total!="number"){
    //     per_grad="Data Not Avaliable";
    //     per_ungrad="Data Not Avaliable";
    // }


    var parent="svg_school_level_"+number;
    if(total && typeof total=="number"){
        let stackedBar_gen = new StackedBar(parent, [parseInt(per_grad),parseInt(per_ungrad)], ['Graduate Students','Undergraduate Students']);
    }


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
    var per_female=(female/(male+female)*100).toFixed(2);
    // if(male+female==0 || typeof (male+female)!="number"){
    //     per_male="Data Not Avaliable";
    //     per_female="Data Not Avaliable";
    // }
    var parent="svg_school_gen_"+number;
    if(male+female!=0 && typeof (male+female)=="number"){
        let stackedBar_gen = new StackedBar(parent, [parseInt(per_male),parseInt(per_female)], ['Male','Female']);
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
    var per_white=(white/(total_eth)*100).toFixed(2);

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
        let stackedBar_eth = new StackedBar(parent, [parseInt(per_asian),parseInt(per_black),parseInt(per_hispanic),parseInt(per_native),parseInt(per_other),parseInt(per_white)], ['Asian','Black','Hispanic','Native American','Other', 'White']);
    }


}

function end_popup(){
    document.querySelector('#start_div').style.display = 'none';

}

// toggle modal
$('#initial-modal').modal('toggle');

//Start with invisible placeholder bars
function invis_start(parent_name){
    var margin = {top: 30, right: 30, bottom: 30, left: 60};
    console.log(margin)
    var width = window.innerWidth/2.2 - margin.left - margin.right;
    var height = 100 - margin.top -margin.bottom;

    console.log("HERE")
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

load_data();