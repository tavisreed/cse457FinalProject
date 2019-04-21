class Trends {
    constructor(parent, data) {
        this.parent = parent;
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        // initialize data
        self.years = create_years(1999,2018);
        self.schools = self.data['2018'].map(function(d) { return d.name; });
        self.load_trends_page();
    }

    load_trends_page() {
        let self = this;

        // parse data for line charts
        let parse_time = d3.timeParse("%Y");
        let years = create_years(1999,2018);

        // get tuition data over years
        let public_tuition_data = years.map(function(d) {
            var tuition=0;
            var tuition_counter=0;
            for (var i=0;i<self.data[d].length;i++){
                if (self.data[d][i].type=="PUBLIC"){
                    if (self.data[d][i].tuition[0]!="none"&&self.data[d][i].tuition[0]!="n" && self.data[d][i].tuition[0]!=0){
                        tuition=tuition+self.data[d][i].tuition[0];
                        tuition_counter=tuition_counter+1;
                    }
                }
            }
            tuition=tuition/tuition_counter;
            return {
                'date': parse_time(d),
                'value': tuition,
            }
        });

        let private_tuition_data = years.map(function(d) {
            var tuition=0;
            var tuition_counter=0;
            for (var i=0;i<self.data[d].length;i++){
                if (self.data[d][i].type=="PRIVATE"){
                    if (self.data[d][i].tuition[0]!="none"&&self.data[d][i].tuition[0]!="n" && self.data[d][i].tuition[0]!=0){
                        tuition=tuition+self.data[d][i].tuition[0];
                        tuition_counter=tuition_counter+1;
                    }
                }
            }
            tuition=tuition/tuition_counter;
            return {
                'date': parse_time(d),
                'value': tuition,
            }
        });

        // get enrollment data for grad and under grad over the years;
        let public_enroll_data = years.map(function(d) {
            var graduate_enroll=0;
            var undergrad_enroll=0;
            for (var i=0;i<self.data[d].length;i++) {
                if (self.data[d][i].type=="PUBLIC"){
                    if (self.data[d][i].graduate_enroll[0]!="none"&&self.data[d][i].graduate_enroll[0]!="n"){
                        graduate_enroll=graduate_enroll+self.data[d][i].graduate_enroll;
                    }
                    if (self.data[d][i].undergrad_enroll[0]!="none"&&self.data[d][i].undergrad_enroll[0]!="n"){
                        undergrad_enroll=undergrad_enroll+self.data[d][i].undergrad_enroll;
                    }
                }
            }
                return {
                'date': parse_time(d),
                'graduate_enroll': graduate_enroll,
                'undergrad_enroll': undergrad_enroll
            }
        });
        let private_enroll_data = years.map(function(d) {
            var graduate_enroll=0;
            var undergrad_enroll=0;
            for (var i=0;i<self.data[d].length;i++) {
                if (self.data[d][i].type=="PRIVATE"){
                    if (self.data[d][i].graduate_enroll[0]!="none"&&self.data[d][i].graduate_enroll[0]!="n"){
                        graduate_enroll=graduate_enroll+self.data[d][i].graduate_enroll;
                    }
                    if (self.data[d][i].undergrad_enroll[0]!="none"&&self.data[d][i].undergrad_enroll[0]!="n"){
                        undergrad_enroll=undergrad_enroll+self.data[d][i].undergrad_enroll;
                    }
                }
            }


            return {
                'date': parse_time(d),
                'graduate_enroll': graduate_enroll,
                'undergrad_enroll': undergrad_enroll
            }
        });

        // get enrollment by gender data
        let public_gender_data = years.map(function(d) {
            var freshM=0;
            var freshF=0;
            var sophM=0;
            var sophF=0;
            var juM=0;
            var juF=0;
            var senM=0;
            var senF=0;
            for (var i=0;i<self.data[d].length;i++){

                if(self.data[d][i].type=="PUBLIC"){
                    if (self.data[d][i].freshmen_enroll_table !="none"){
                        freshM=freshM+self.data[d][i].freshmen_enroll_table.gender.male;
                        freshF=freshF+self.data[d][i].freshmen_enroll_table.gender.female;
                    }
                    if (self.data[d][i].sophomore_enroll_table !="none"){
                        sophM=sophM+self.data[d][i].sophomore_enroll_table.gender.male;
                        sophF=sophF+self.data[d][i].sophomore_enroll_table.gender.female;
                    }
                    if (self.data[d][i].junior_enroll_table !="none"){
                        juM=juM+self.data[d][i].junior_enroll_table.gender.male;
                        juF=juF+self.data[d][i].junior_enroll_table.gender.female;
                    }
                    if (self.data[d][i].senior_enroll_table !="none"){
                        senM=senM+self.data[d][i].senior_enroll_table.gender.male;
                        senF=senF+self.data[d][i].senior_enroll_table.gender.female;
                    }
                }
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
        let private_gender_data = years.map(function(d) {
            var freshM=0;
            var freshF=0;
            var sophM=0;
            var sophF=0;
            var juM=0;
            var juF=0;
            var senM=0;
            var senF=0;
            for (var i=0;i<self.data[d].length;i++){

                if(self.data[d][i].type=="PRIVATE"){
                    if (self.data[d][i].freshmen_enroll_table !="none"){
                        freshM=freshM+self.data[d][i].freshmen_enroll_table.gender.male;
                        freshF=freshF+self.data[d][i].freshmen_enroll_table.gender.female;
                    }
                    if (self.data[d][i].sophomore_enroll_table !="none"){
                        sophM=sophM+self.data[d][i].sophomore_enroll_table.gender.male;
                        sophF=sophF+self.data[d][i].sophomore_enroll_table.gender.female;
                    }
                    if (self.data[d][i].junior_enroll_table !="none"){
                        juM=juM+self.data[d][i].junior_enroll_table.gender.male;
                        juF=juF+self.data[d][i].junior_enroll_table.gender.female;
                    }
                    if (self.data[d][i].senior_enroll_table !="none"){
                        senM=senM+self.data[d][i].senior_enroll_table.gender.male;
                        senF=senF+self.data[d][i].senior_enroll_table.gender.female;
                    }
                }
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


        // get ethnicity by gender data
        let public_ethnicity_data = years.map(function(d) {
            var asian=0;
            var black=0;
            var hispanic=0;
            var native_american=0;
            var other=0;
            var white=0;
            for (var i=0; i<self.data[d].length;i++){
                if(self.data[d][i].type=="PUBLIC"){
                    if (self.data[d][i].freshmen_enroll_table !="none"){
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].freshmen_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].freshmen_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].freshmen_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].freshmen_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].freshmen_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].freshmen_enroll_table.ethnicity.white;
                        }
                    }
                    if (self.data[d][i].sophomore_enroll_table !="none"){
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].sophomore_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].sophomore_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].sophomore_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].sophomore_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].sophomore_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].sophomore_enroll_table.ethnicity.white;
                        }

                    }
                    if (self.data[d][i].junior_enroll_table !="none"){
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].junior_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].junior_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].junior_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].junior_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].junior_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].junior_enroll_table.ethnicity.white;
                        }

                    }
                    if (self.data[d][i].senior_enroll_table !="none"){
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].senior_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].senior_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].senior_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].senior_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].senior_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].senior_enroll_table.ethnicity.white;
                        }

                    }
                }

            }
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
        let private_ethnicity_data = years.map(function(d) {
            var asian=0;
            var black=0;
            var hispanic=0;
            var native_american=0;
            var other=0;
            var white=0;
            for (var i=0; i<self.data[d].length;i++){
                if(self.data[d][i].type=="PRIVATE"){
                    if (self.data[d][i].freshmen_enroll_table !="none"){
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].freshmen_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].freshmen_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].freshmen_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].freshmen_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].freshmen_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].freshmen_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].freshmen_enroll_table.ethnicity.white;
                        }
                    }
                    if (self.data[d][i].sophomore_enroll_table !="none"){
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].sophomore_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].sophomore_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].sophomore_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].sophomore_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].sophomore_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].sophomore_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].sophomore_enroll_table.ethnicity.white;
                        }

                    }
                    if (self.data[d][i].junior_enroll_table !="none"){
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].junior_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].junior_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].junior_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].junior_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].junior_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].junior_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].junior_enroll_table.ethnicity.white;
                        }

                    }
                    if (self.data[d][i].senior_enroll_table !="none"){
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.asian=="number"){
                            asian=asian+self.data[d][i].senior_enroll_table.ethnicity.asian;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.black=="number"){
                            black=black+self.data[d][i].senior_enroll_table.ethnicity.black;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.hispanic=="number"){
                            hispanic=hispanic+self.data[d][i].senior_enroll_table.ethnicity.hispanic;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity["native-american"]=="number"){
                            native_american=native_american+self.data[d][i].senior_enroll_table.ethnicity["native-american"];
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.other=="number"){
                            other=other+self.data[d][i].senior_enroll_table.ethnicity.other;
                        }
                        if(typeof self.data[d][i].senior_enroll_table.ethnicity.white=="number"){
                            white=white+self.data[d][i].senior_enroll_table.ethnicity.white;
                        }

                    }
                }

            }

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

        // // parse year data
        let dates = years.map(function(d) {
            return parse_time(d);
        });

        // create event handler
        var event_handler = {};

        // create year chart for brushing
        let year_chart = new YearChart('trends_year_chart', dates, event_handler);
        //
        // create tuition area chart
        let tuition_chart = new Line('trends_tuition_line', public_tuition_data, private_tuition_data, 2);

        // create enrollment stacked area charts
        let public_enrollment_chart = new StackedArea('public_enroll', public_enroll_data, ['graduate_enroll', 'undergrad_enroll']);
        let private_enrollment_chart = new StackedArea('private_enroll', private_enroll_data, ['graduate_enroll', 'undergrad_enroll']);

        //Create enrollment by gender area charts
        let public_gender_chart = new StackedArea('public_gender', public_gender_data, ['freshM', 'freshF','sophM','sophF','juM','juF','senM','senF']);
        let private_gender_chart = new StackedArea('private_gender', private_gender_data, ['freshM', 'freshF','sophM','sophF','juM','juF','senM','senF']);

        //Create enrollment by ethnicity area chart
        let public_ethnicity_chart = new StackedArea('public_ethnicity', public_ethnicity_data, ['asian', 'black','hispanic','native_american','other','white']);
        let private_ethnicity_chart = new StackedArea('private_ethnicity', private_ethnicity_data, ['asian', 'black','hispanic','native_american','other','white']);

        // bind brush event to event handler
        $(event_handler).bind("selectionChanged", function(event, selectionStart, selectionEnd) {
            tuition_chart.onSelectionChange(selectionStart, selectionEnd);
            public_enrollment_chart.onSelectionChange(selectionStart, selectionEnd);
            private_enrollment_chart.onSelectionChange(selectionStart, selectionEnd);
            public_gender_chart.onSelectionChange(selectionStart, selectionEnd);
            private_gender_chart.onSelectionChange(selectionStart, selectionEnd);
            public_ethnicity_chart.onSelectionChange(selectionStart, selectionEnd);
            private_ethnicity_chart.onSelectionChange(selectionStart, selectionEnd);

        });
        // make trends content visible
        document.querySelector('#trends #trends_content').style.display = 'block';
    }
}