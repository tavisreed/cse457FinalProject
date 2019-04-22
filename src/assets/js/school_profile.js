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
  }

  load_profile(school_idx) {
    let self = this;
    // initialize school attributes
    let name = self.data['2018'][school_idx].name;
    let description = self.data['2018'][school_idx].description;

    // set html text
    document.querySelector('#profiles #name').innerHTML = name;
    //document.querySelector('#profiles #description').innerHTML = description;

    // parse data for line charts
    let parse_time = d3.timeParse("%Y");
    let years = create_years(1999,2018);

    // get tuition data over years
    let tuition_data = years.map(function(d) {
      var tuition=self.data[d][school_idx].tuition[0];
      //Get an average for missing values
      if (typeof tuition!="number"){
        var pre=0;
        var nxt=0;
        if (d>1999){
          pre=self.data[d-1][school_idx].tuition[0];
          nxt=self.data[d-1][school_idx].tuition[0];
        }
        if(d<2018){
          nxt=self.data[d+1][school_idx].tuition[0];
        }
        tuition=(pre+nxt)/2;
      }
      return {
        'date': parse_time(d),
        'value':tuition
      }
    });

    // get enrollment data for grad and under grad over the years;
    let enroll_data = years.map(function(d) {
      var graduate_enroll=self.data[d][school_idx].graduate_enroll;
      var undergrad_enroll=self.data[d][school_idx].undergrad_enroll;
      //Get an average for missing values
      if (typeof graduate_enroll!="number"){
        var pre=0;
        var nxt=0;
        if (d>1999){
          pre=self.data[d-1][school_idx].graduate_enroll;
          nxt=self.data[d-1][school_idx].graduate_enroll;
        }
        if(d<2018){
          nxt=self.data[d+1][school_idx].graduate_enroll;
        }
        if(typeof pre!="number"){
            pre=0;
            if (d>2000){
                pre=self.data[d-2][school_idx].graduate_enroll;
                nxt=self.data[d-2][school_idx].graduate_enroll;
            }
        }
        if(typeof nxt!="number"){
            nxt=0;
              if (d<2017){
                  nxt=self.data[d+2][school_idx].graduate_enroll;
              }
          }


          graduate_enroll=(pre+nxt)/2;
      }
      if (typeof undergrad_enroll!="number"){
        var pre=0;
        var nxt=0;
        if (d>1999){
          pre=self.data[d-1][school_idx].undergrad_enroll;
          nxt=self.data[d-1][school_idx].undergrad_enroll;
        }
        if(d<2018){
          nxt=self.data[d+1][school_idx].undergrad_enroll;
        }
          if(typeof pre!="number"){
              pre=0;
              if (d>2000){
                  pre=self.data[d-2][school_idx].graduate_enroll;
                  nxt=self.data[d-2][school_idx].graduate_enroll;
              }
          }
          if(typeof nxt!="number"){
              nxt=0;
              if (d<2017){
                  nxt=self.data[d+2][school_idx].graduate_enroll;
              }
          }
        undergrad_enroll=(pre+nxt)/2;
      }

      return {
        'date': parse_time(d),
        'graduate_enroll': graduate_enroll,
        'undergrad_enroll': undergrad_enroll
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
      //Freshmen values
      if (self.data[d][school_idx].freshmen_enroll_table !="none"){
        freshM=self.data[d][school_idx].freshmen_enroll_table.gender.male;
        freshF=self.data[d][school_idx].freshmen_enroll_table.gender.female;
      }
      else if(self.data[d][school_idx].freshmen_enroll_table =="none" && d>2005){
              var preM=0;
              var preF=0;
              var nxtM=0;
              var nxtF=0;
              if (d>2005){
                  preM=self.data[d-1][school_idx].freshmen_enroll_table.gender.male;
                  nxtM=self.data[d-1][school_idx].freshmen_enroll_table.gender.male;
                  preF=self.data[d-1][school_idx].freshmen_enroll_table.gender.female;
                  nxtF=self.data[d-1][school_idx].freshmen_enroll_table.gender.female;
              }
              if(d<2018){
                  nxtM=self.data[d+1][school_idx].freshmen_enroll_table.gender.male;
                  nxtF=self.data[d+1][school_idx].freshmen_enroll_table.gender.female;
              }
              if(typeof preM!="number"){
                  preM=0;
                  preF=0;
                  if (d>2006){
                      preM=self.data[d-2][school_idx].freshmen_enroll_table.gender.male;
                      nxtM=self.data[d-2][school_idx].freshmen_enroll_table.gender.male;
                      preF=self.data[d-2][school_idx].freshmen_enroll_table.gender.female;
                      nxtF=self.data[d-2][school_idx].freshmen_enroll_table.gender.female;
                  }
              }
              if(typeof nxtM!="number"){
                  nxtM=0;
                  nxtF=0;
                  if (d<2017){
                      nxtM=self.data[d+2][school_idx].freshmen_enroll_table.gender.male;
                      nxtF=self.data[d+2][school_idx].freshmen_enroll_table.gender.female;
                  }
              }


          freshM=(preM+nxtM)/2;
          freshF=(preF+nxtF)/2;

      }
      //Sophomore values
      if (self.data[d][school_idx].sophomore_enroll_table !="none"){
        sophM=self.data[d][school_idx].sophomore_enroll_table.gender.male;
        sophF=self.data[d][school_idx].sophomore_enroll_table.gender.female;
      }
      else if(self.data[d][school_idx].sophomore_enroll_table =="none" && d>2005){
          var preM=0;
          var preF=0;
          var nxtM=0;
          var nxtF=0;
          if (d>2005){
              preM=self.data[d-1][school_idx].sophomore_enroll_table.gender.male;
              nxtM=self.data[d-1][school_idx].sophomore_enroll_table.gender.male;
              preF=self.data[d-1][school_idx].sophomore_enroll_table.gender.female;
              nxtF=self.data[d-1][school_idx].sophomore_enroll_table.gender.female;
          }
          if(d<2018){
              nxtM=self.data[d+1][school_idx].sophomore_enroll_table.gender.male;
              nxtF=self.data[d+1][school_idx].sophomore_enroll_table.gender.female;
          }
          if(typeof preM!="number"){
              preM=0;
              preF=0;
              if (d>2006){
                  preM=self.data[d-2][school_idx].sophomore_enroll_table.gender.male;
                  nxtM=self.data[d-2][school_idx].sophomore_enroll_table.gender.male;
                  preF=self.data[d-2][school_idx].sophomore_enroll_table.gender.female;
                  nxtF=self.data[d-2][school_idx].sophomore_enroll_table.gender.female;
              }
          }
          if(typeof nxtM!="number"){
              nxtM=0;
              nxtF=0;
              if (d<2017){
                  nxtM=self.data[d+2][school_idx].sophomore_enroll_table.gender.male;
                  nxtF=self.data[d+2][school_idx].sophomore_enroll_table.gender.female;
              }
          }


          sophM=(preM+nxtM)/2;
          sophF=(preF+nxtF)/2;

      }
      //Junior values
      if (self.data[d][school_idx].junior_enroll_table !="none"){
        juM=self.data[d][school_idx].junior_enroll_table.gender.male;
        juF=self.data[d][school_idx].junior_enroll_table.gender.female;
      }
      else if(self.data[d][school_idx].junior_enroll_table =="none" && d>2005){
          var preM=0;
          var preF=0;
          var nxtM=0;
          var nxtF=0;
          if (d>2005){
              preM=self.data[d-1][school_idx].junior_enroll_table.gender.male;
              nxtM=self.data[d-1][school_idx].junior_enroll_table.gender.male;
              preF=self.data[d-1][school_idx].junior_enroll_table.gender.female;
              nxtF=self.data[d-1][school_idx].junior_enroll_table.gender.female;
          }
          if(d<2018){
              nxtM=self.data[d+1][school_idx].junior_enroll_table.gender.male;
              nxtF=self.data[d+1][school_idx].junior_enroll_table.gender.female;
          }
          if(typeof preM!="number"){
              preM=0;
              preF=0;
              if (d>2006){
                  preM=self.data[d-2][school_idx].junior_enroll_table.gender.male;
                  nxtM=self.data[d-2][school_idx].junior_enroll_table.gender.male;
                  preF=self.data[d-2][school_idx].junior_enroll_table.gender.female;
                  nxtF=self.data[d-2][school_idx].junior_enroll_table.gender.female;
              }
          }
          if(typeof nxtM!="number"){
              nxtM=0;
              nxtF=0;
              if (d<2017){
                  nxtM=self.data[d+2][school_idx].junior_enroll_table.gender.male;
                  nxtF=self.data[d+2][school_idx].junior_enroll_table.gender.female;
              }
          }


          juM=(preM+nxtM)/2;
          juF=(preF+nxtF)/2;
      }

        //Senior values
      if (self.data[d][school_idx].senior_enroll_table !="none"){
        senM=self.data[d][school_idx].senior_enroll_table.gender.male;
        senF=self.data[d][school_idx].senior_enroll_table.gender.female;
      }
      else if(self.data[d][school_idx].senior_enroll_table =="none" && d>2005){
          var preM=0;
          var preF=0;
          var nxtM=0;
          var nxtF=0;
          if (d>2005){
              preM=self.data[d-1][school_idx].senior_enroll_table.gender.male;
              nxtM=self.data[d-1][school_idx].senior_enroll_table.gender.male;
              preF=self.data[d-1][school_idx].senior_enroll_table.gender.female;
              nxtF=self.data[d-1][school_idx].senior_enroll_table.gender.female;
          }
          if(d<2018){
              nxtM=self.data[d+1][school_idx].senior_enroll_table.gender.male;
              nxtF=self.data[d+1][school_idx].senior_enroll_table.gender.female;
          }
          if(typeof preM!="number"){
              preM=0;
              preF=0;
              if (d>2006){
                  preM=self.data[d-2][school_idx].senior_enroll_table.gender.male;
                  nxtM=self.data[d-2][school_idx].senior_enroll_table.gender.male;
                  preF=self.data[d-2][school_idx].senior_enroll_table.gender.female;
                  nxtF=self.data[d-2][school_idx].senior_enroll_table.gender.female;
              }
          }
          if(typeof nxtM!="number"){
              nxtM=0;
              nxtF=0;
              if (d<2017){
                  nxtM=self.data[d+2][school_idx].senior_enroll_table.gender.male;
                  nxtF=self.data[d+2][school_idx].senior_enroll_table.gender.female;
              }
          }


          senM=(preM+nxtM)/2;
          senF=(preF+nxtF)/2;

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
      //Freshmen table
      if (self.data[d][school_idx].freshmen_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].freshmen_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].freshmen_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].freshmen_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].freshmen_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].freshmen_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].freshmen_enroll_table.ethnicity.white;
      }
      else if(self.data[d][school_idx].freshmen_enroll_table =="none" && d>2005){
          var preA=0;
          var preB=0;
          var preH=0;
          var preN=0;
          var preO=0;
          var preW=0;

          var nxtA=0;
          var nxtB=0;
          var nxtH=0;
          var nxtN=0;
          var nxtO=0;
          var nxtW=0;

          if (d>2005){
              preA=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.asian;
              nxtA=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.asian;

              preB=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.black;
              nxtB=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.black;

              preH=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.hispanic;
              nxtH=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.hispanic;

              preN=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity["native-american"];
              nxtN=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity["native-american"];

              preO=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.other;
              nxtO=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.other;

              preW=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.white;
              nxtW=self.data[d-1][school_idx].freshmen_enroll_table.ethnicity.white;

          }
          if(d<2018){
              nxtA=self.data[d+1][school_idx].freshmen_enroll_table.ethnicity.asian;
              nxtB=self.data[d+1][school_idx].freshmen_enroll_table.ethnicity.black;
              nxtH=self.data[d+1][school_idx].freshmen_enroll_table.ethnicity.hispanic;
              nxtN=self.data[d+1][school_idx].freshmen_enroll_table.ethnicity["native-american"];
              nxtO=self.data[d+1][school_idx].freshmen_enroll_table.ethnicity.other;
              nxtW=self.data[d+1][school_idx].freshmen_enroll_table.ethnicity.white;
          }
          if(typeof preA!="number"){
              var preA=0;
              var preB=0;
              var preH=0;
              var preN=0;
              var preO=0;
              var preW=0;
              if (d>2006){
                  preA=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.asian;
                  nxtA=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.asian;

                  preB=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.black;
                  nxtB=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.black;

                  preH=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.hispanic;
                  nxtH=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.hispanic;

                  preN=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity["native-american"];
                  nxtN=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity["native-american"];

                  preO=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.other;
                  nxtO=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.other;

                  preW=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.white;
                  nxtW=self.data[d-2][school_idx].freshmen_enroll_table.ethnicity.white;
              }
          }
          if(typeof preA!="number"){
              var nxtA=0;
              var nxtB=0;
              var nxtH=0;
              var nxtN=0;
              var nxtO=0;
              var nxtW=0;
              if (d<2017){

                  nxtA=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.asian;
                  nxtB=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.black;
                  nxtH=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.hispanic;
                  nxtN=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity["native-american"];
                  nxtO=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.other;
                  nxtW=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.white;
              }
          }


          asian=asian+(preA+nxtA)/2;
          black=black+(preB+nxtB)/2;
          hispanic=hispanic+(preH+nxtH)/2;
          native_american=native_american+(preN+nxtN)/2;
          other=other+(preO+nxtO)/2;
          white=white+(preW+nxtW)/2;

      }

      //Sophomore table
      if (self.data[d][school_idx].sophomore_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].sophomore_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].sophomore_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].sophomore_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].sophomore_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].sophomore_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].sophomore_enroll_table.ethnicity.white;
      }
      else if(self.data[d][school_idx].sophomore_enroll_table =="none" && d>2005){
          var preA=0;
          var preB=0;
          var preH=0;
          var preN=0;
          var preO=0;
          var preW=0;

          var nxtA=0;
          var nxtB=0;
          var nxtH=0;
          var nxtN=0;
          var nxtO=0;
          var nxtW=0;

          if (d>2005){
              preA=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.asian;
              nxtA=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.asian;

              preB=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.black;
              nxtB=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.black;

              preH=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.hispanic;
              nxtH=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.hispanic;

              preN=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity["native-american"];
              nxtN=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity["native-american"];

              preO=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.other;
              nxtO=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.other;

              preW=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.white;
              nxtW=self.data[d-1][school_idx].sophomore_enroll_table.ethnicity.white;

          }
          if(d<2018){
              nxtA=self.data[d+1][school_idx].sophomore_enroll_table.ethnicity.asian;
              nxtB=self.data[d+1][school_idx].sophomore_enroll_table.ethnicity.black;
              nxtH=self.data[d+1][school_idx].sophomore_enroll_table.ethnicity.hispanic;
              nxtN=self.data[d+1][school_idx].sophomore_enroll_table.ethnicity["native-american"];
              nxtO=self.data[d+1][school_idx].sophomore_enroll_table.ethnicity.other;
              nxtW=self.data[d+1][school_idx].sophomore_enroll_table.ethnicity.white;
          }
          if(typeof preA!="number"){
              var preA=0;
              var preB=0;
              var preH=0;
              var preN=0;
              var preO=0;
              var preW=0;
              if (d>2006){
                  preA=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.asian;
                  nxtA=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.asian;

                  preB=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.black;
                  nxtB=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.black;

                  preH=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.hispanic;
                  nxtH=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.hispanic;

                  preN=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity["native-american"];
                  nxtN=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity["native-american"];

                  preO=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.other;
                  nxtO=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.other;

                  preW=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.white;
                  nxtW=self.data[d-2][school_idx].sophomore_enroll_table.ethnicity.white;
              }
          }
          if(typeof preA!="number"){
              var nxtA=0;
              var nxtB=0;
              var nxtH=0;
              var nxtN=0;
              var nxtO=0;
              var nxtW=0;
              if (d<2017){

                  nxtA=self.data[d+2][school_idx].sophomore_enroll_table.ethnicity.asian;
                  nxtB=self.data[d+2][school_idx].sophomore_enroll_table.ethnicity.black;
                  nxtH=self.data[d+2][school_idx].sophomore_enroll_table.ethnicity.hispanic;
                  nxtN=self.data[d+2][school_idx].sophomore_enroll_table.ethnicity["native-american"];
                  nxtO=self.data[d+2][school_idx].sophomore_enroll_table.ethnicity.other;
                  nxtW=self.data[d+2][school_idx].sophomore_enroll_table.ethnicity.white;
              }
          }


          asian=asian+(preA+nxtA)/2;
          black=black+(preB+nxtB)/2;
          hispanic=hispanic+(preH+nxtH)/2;
          native_american=native_american+(preN+nxtN)/2;
          other=other+(preO+nxtO)/2;
          white=white+(preW+nxtW)/2;

      }

      //Junior table
      if (self.data[d][school_idx].junior_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].junior_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].junior_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].junior_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].junior_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].junior_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].junior_enroll_table.ethnicity.white;
      }
      else if(self.data[d][school_idx].junior_enroll_table =="none" && d>2005){
          var preA=0;
          var preB=0;
          var preH=0;
          var preN=0;
          var preO=0;
          var preW=0;

          var nxtA=0;
          var nxtB=0;
          var nxtH=0;
          var nxtN=0;
          var nxtO=0;
          var nxtW=0;

          if (d>2005){
              preA=self.data[d-1][school_idx].junior_enroll_table.ethnicity.asian;
              nxtA=self.data[d-1][school_idx].junior_enroll_table.ethnicity.asian;

              preB=self.data[d-1][school_idx].junior_enroll_table.ethnicity.black;
              nxtB=self.data[d-1][school_idx].junior_enroll_table.ethnicity.black;

              preH=self.data[d-1][school_idx].junior_enroll_table.ethnicity.hispanic;
              nxtH=self.data[d-1][school_idx].junior_enroll_table.ethnicity.hispanic;

              preN=self.data[d-1][school_idx].junior_enroll_table.ethnicity["native-american"];
              nxtN=self.data[d-1][school_idx].junior_enroll_table.ethnicity["native-american"];

              preO=self.data[d-1][school_idx].junior_enroll_table.ethnicity.other;
              nxtO=self.data[d-1][school_idx].junior_enroll_table.ethnicity.other;

              preW=self.data[d-1][school_idx].junior_enroll_table.ethnicity.white;
              nxtW=self.data[d-1][school_idx].junior_enroll_table.ethnicity.white;

          }
          if(d<2018){
              nxtA=self.data[d+1][school_idx].junior_enroll_table.ethnicity.asian;
              nxtB=self.data[d+1][school_idx].junior_enroll_table.ethnicity.black;
              nxtH=self.data[d+1][school_idx].junior_enroll_table.ethnicity.hispanic;
              nxtN=self.data[d+1][school_idx].junior_enroll_table.ethnicity["native-american"];
              nxtO=self.data[d+1][school_idx].junior_enroll_table.ethnicity.other;
              nxtW=self.data[d+1][school_idx].junior_enroll_table.ethnicity.white;
          }
          if(typeof preA!="number"){
              var preA=0;
              var preB=0;
              var preH=0;
              var preN=0;
              var preO=0;
              var preW=0;
              if (d>2006){
                  preA=self.data[d-2][school_idx].junior_enroll_table.ethnicity.asian;
                  nxtA=self.data[d-2][school_idx].junior_enroll_table.ethnicity.asian;

                  preB=self.data[d-2][school_idx].junior_enroll_table.ethnicity.black;
                  nxtB=self.data[d-2][school_idx].junior_enroll_table.ethnicity.black;

                  preH=self.data[d-2][school_idx].junior_enroll_table.ethnicity.hispanic;
                  nxtH=self.data[d-2][school_idx].junior_enroll_table.ethnicity.hispanic;

                  preN=self.data[d-2][school_idx].junior_enroll_table.ethnicity["native-american"];
                  nxtN=self.data[d-2][school_idx].junior_enroll_table.ethnicity["native-american"];

                  preO=self.data[d-2][school_idx].junior_enroll_table.ethnicity.other;
                  nxtO=self.data[d-2][school_idx].junior_enroll_table.ethnicity.other;

                  preW=self.data[d-2][school_idx].junior_enroll_table.ethnicity.white;
                  nxtW=self.data[d-2][school_idx].junior_enroll_table.ethnicity.white;
              }
          }
          if(typeof preA!="number"){
              var nxtA=0;
              var nxtB=0;
              var nxtH=0;
              var nxtN=0;
              var nxtO=0;
              var nxtW=0;
              if (d<2017){

                  nxtA=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.asian;
                  nxtB=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.black;
                  nxtH=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.hispanic;
                  nxtN=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity["native-american"];
                  nxtO=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.other;
                  nxtW=self.data[d+2][school_idx].freshmen_enroll_table.ethnicity.white;
              }
          }


          asian=asian+(preA+nxtA)/2;
          black=black+(preB+nxtB)/2;
          hispanic=hispanic+(preH+nxtH)/2;
          native_american=native_american+(preN+nxtN)/2;
          other=other+(preO+nxtO)/2;
          white=white+(preW+nxtW)/2;

      }

      //Senior table
      if (self.data[d][school_idx].senior_enroll_table !="none"){
        asian=asian+self.data[d][school_idx].senior_enroll_table.ethnicity.asian;
        black=black+self.data[d][school_idx].senior_enroll_table.ethnicity.black;
        hispanic=hispanic+self.data[d][school_idx].senior_enroll_table.ethnicity.hispanic;
        native_american=native_american+self.data[d][school_idx].senior_enroll_table.ethnicity["native-american"];
        other=other+self.data[d][school_idx].senior_enroll_table.ethnicity.other;
        white=white+self.data[d][school_idx].senior_enroll_table.ethnicity.white;
      }
      else if(self.data[d][school_idx].senior_enroll_table =="none" && d>2005){
          var preA=0;
          var preB=0;
          var preH=0;
          var preN=0;
          var preO=0;
          var preW=0;

          var nxtA=0;
          var nxtB=0;
          var nxtH=0;
          var nxtN=0;
          var nxtO=0;
          var nxtW=0;

          if (d>2005){
              preA=self.data[d-1][school_idx].senior_enroll_table.ethnicity.asian;
              nxtA=self.data[d-1][school_idx].senior_enroll_table.ethnicity.asian;

              preB=self.data[d-1][school_idx].senior_enroll_table.ethnicity.black;
              nxtB=self.data[d-1][school_idx].senior_enroll_table.ethnicity.black;

              preH=self.data[d-1][school_idx].senior_enroll_table.ethnicity.hispanic;
              nxtH=self.data[d-1][school_idx].senior_enroll_table.ethnicity.hispanic;

              preN=self.data[d-1][school_idx].senior_enroll_table.ethnicity["native-american"];
              nxtN=self.data[d-1][school_idx].senior_enroll_table.ethnicity["native-american"];

              preO=self.data[d-1][school_idx].senior_enroll_table.ethnicity.other;
              nxtO=self.data[d-1][school_idx].senior_enroll_table.ethnicity.other;

              preW=self.data[d-1][school_idx].senior_enroll_table.ethnicity.white;
              nxtW=self.data[d-1][school_idx].senior_enroll_table.ethnicity.white;

          }
          if(d<2018){
              nxtA=self.data[d+1][school_idx].senior_enroll_table.ethnicity.asian;
              nxtB=self.data[d+1][school_idx].senior_enroll_table.ethnicity.black;
              nxtH=self.data[d+1][school_idx].senior_enroll_table.ethnicity.hispanic;
              nxtN=self.data[d+1][school_idx].senior_enroll_table.ethnicity["native-american"];
              nxtO=self.data[d+1][school_idx].senior_enroll_table.ethnicity.other;
              nxtW=self.data[d+1][school_idx].senior_enroll_table.ethnicity.white;
          }
          if(typeof preA!="number"){
              var preA=0;
              var preB=0;
              var preH=0;
              var preN=0;
              var preO=0;
              var preW=0;
              if (d>2006){
                  preA=self.data[d-2][school_idx].senior_enroll_table.ethnicity.asian;
                  nxtA=self.data[d-2][school_idx].senior_enroll_table.ethnicity.asian;

                  preB=self.data[d-2][school_idx].senior_enroll_table.ethnicity.black;
                  nxtB=self.data[d-2][school_idx].senior_enroll_table.ethnicity.black;

                  preH=self.data[d-2][school_idx].senior_enroll_table.ethnicity.hispanic;
                  nxtH=self.data[d-2][school_idx].senior_enroll_table.ethnicity.hispanic;

                  preN=self.data[d-2][school_idx].senior_enroll_table.ethnicity["native-american"];
                  nxtN=self.data[d-2][school_idx].senior_enroll_table.ethnicity["native-american"];

                  preO=self.data[d-2][school_idx].senior_enroll_table.ethnicity.other;
                  nxtO=self.data[d-2][school_idx].senior_enroll_table.ethnicity.other;

                  preW=self.data[d-2][school_idx].senior_enroll_table.ethnicity.white;
                  nxtW=self.data[d-2][school_idx].senior_enroll_table.ethnicity.white;
              }
          }
          if(typeof preA!="number"){
              var nxtA=0;
              var nxtB=0;
              var nxtH=0;
              var nxtN=0;
              var nxtO=0;
              var nxtW=0;
              if (d<2017){

                  nxtA=self.data[d+2][school_idx].senior_enroll_table.ethnicity.asian;
                  nxtB=self.data[d+2][school_idx].senior_enroll_table.ethnicity.black;
                  nxtH=self.data[d+2][school_idx].senior_enroll_table.ethnicity.hispanic;
                  nxtN=self.data[d+2][school_idx].senior_enroll_table.ethnicity["native-american"];
                  nxtO=self.data[d+2][school_idx].senior_enroll_table.ethnicity.other;
                  nxtW=self.data[d+2][school_idx].senior_enroll_table.ethnicity.white;
              }
          }


          asian=asian+(preA+nxtA)/2;
          black=black+(preB+nxtB)/2;
          hispanic=hispanic+(preH+nxtH)/2;
          native_american=native_american+(preN+nxtN)/2;
          other=other+(preO+nxtO)/2;
          white=white+(preW+nxtW)/2;

      }


        //Fix other data
      if (d<2010){
        other=0;
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
    console.log(ethnicity_data)
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
    let enrollment_chart = new StackedArea('enroll_area', enroll_data, ['graduate_enroll', 'undergrad_enroll'],2);

    //Create enrollment by gender area chart
    let gender_chart = new StackedArea('Gender_chart', gender_data, ['freshM', 'freshF','sophM','sophF','juM','juF','senM','senF'],8);
    //Create enrollment by ethnicity area chart
    let ethnicity_chart = new StackedArea('Ethnicity_chart', ethnicity_data, ['asian', 'black','hispanic','native_american','other','white'],6);

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
