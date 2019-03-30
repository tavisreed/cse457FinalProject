Wrangle = function(_data) {
    this.data = _data;
    this.processData = [];
    this.wrangleData();
};

Wrangle.prototype.wrangleData = function(){
    let self = this;
    console.log(self.data)

    console.log(typeof self.data[1])

    //consolidate names
    let step1=[];
    let addedNames=[];
    for (let i=0;i<self.data.length;i++){
        if (addedNames.includes(self.data[i].school_name)==false){
            step1.push(self.data[i]);
            addedNames.push(self.data[i].school_name)
        }
    }

    console.log(step1);

    // consolidate data for each school
    for (let j=0;j<step1.length;j++){
        for (let i=0;i<self.data.length;i++) {
            if(self.data[i].school_name==step1[j].school_name){
                if(step1[j].Disciplines==""){
                    step1[j].Disciplines=self.data[i].Disciplines;
                }
                if(step1[j].act_header==""){
                    step1[j].act_header=self.data[i].act_header;
                }
                if(step1[j].departments==""){
                    step1[j].departments=self.data[i].departments;
                }
                if(step1[j].disciplines==""){
                    step1[j].disciplines=self.data[i].disciplines;
                }
                if(step1[j].faculty_numbers==""){
                    step1[j].faculty_numbers=self.data[i].faculty_numbers;
                }
                if(step1[j].g_enorll_masters==""){
                    step1[j].g_enorll_masters=self.data[i].g_enorll_masters;
                }
                if(step1[j].g_enroll_header==""){
                    step1[j].g_enroll_header=self.data[i].g_enroll_header;
                }
                if(step1[j].g_enroll_phd==""){
                    step1[j].g_enroll_phd=self.data[i].g_enroll_phd;
                }
                if(step1[j].g_enrollment==""){
                    step1[j].g_enrollment=self.data[i].g_enrollment;
                }
                if(step1[j].sat_header==""){
                    step1[j].sat_header=self.data[i].sat_header;
                }
                if(step1[j].school_description==""){
                    step1[j].school_description=self.data[i].school_description;
                }
                if(step1[j].school_type==""){
                    step1[j].school_type=self.data[i].school_type;
                }
                if(step1[j].total_g_enrollment==""){
                    step1[j].total_g_enrollment=self.data[i].total_g_enrollment;
                }
                if(step1[j].total_other_enrollment==""){
                    step1[j].total_other_enrollment=self.data[i].total_other_enrollment;
                }
                if(step1[j].total_ug_enrollment==""){
                    step1[j].total_ug_enrollment=self.data[i].total_ug_enrollment;
                }
                if(step1[j].ug_act==""){
                    step1[j].ug_act=self.data[i].ug_act;
                }
                if(step1[j].ug_applicants==""){
                    step1[j].ug_applicants=self.data[i].ug_applicants;
                }
                if(step1[j].ug_enroll_fresh==""){
                    step1[j].ug_enroll_fresh=self.data[i].ug_enroll_fresh;
                }
                if(step1[j].ug_enroll_header==""){
                    step1[j].ug_enroll_header=self.data[i].ug_enroll_header;
                }
                if(step1[j].ug_enroll_junior==""){
                    step1[j].ug_enroll_junior=self.data[i].ug_enroll_junior;
                }
                if(step1[j].ug_enroll_sen==""){
                    step1[j].ug_enroll_sen=self.data[i].ug_enroll_sen;
                }
                if(step1[j].ug_enroll_soph==""){
                    step1[j].ug_enroll_soph=self.data[i].ug_enroll_soph;
                }
                if(step1[j].ug_enrolled==""){
                    step1[j].ug_enrolled=self.data[i].ug_enrolled;
                }
                if(step1[j].ug_enrollment==""){
                    step1[j].ug_enrollment=self.data[i].ug_enrollment;
                }
                if(step1[j].ug_expenses==""){
                    step1[j].ug_expenses=self.data[i].ug_expenses;
                }
                if(step1[j].ug_number_apps==""){
                    step1[j].ug_number_apps=self.data[i].ug_number_apps;
                }
                if(step1[j].ug_number_offered==""){
                    step1[j].ug_number_offered=self.data[i].ug_number_offered;
                }
                if(step1[j].ug_sat==""){
                    step1[j].ug_sat=self.data[i].ug_sat;
                }
                if(step1[j].ug_tuition==""){
                    step1[j].ug_tuition=self.data[i].ug_tuition;
                }
                if(step1[j].g_expenses==""){
                    step1[j].g_expenses=self.data[i].g_expenses;
                }
                if(step1[j].g_tuition==""){
                    step1[j].g_tuition=self.data[i].g_tuition;
                }
            }
        }
    }

    //convert JSON strings to objects
    for (let i=0;i<step1.length;i++){
        if(step1[i].act_header!="" && step1[i].act_header!="null"){
            step1[i].act_header=JSON.parse(step1[i].act_header);
        }
        if(step1[i].Disciplines!="" && step1[i].Disciplines!="null") {
            step1[i].Disciplines=JSON.parse(step1[i].Disciplines);
        }
        if(step1[i].departments!="" && step1[i].departments!="null") {
            step1[i].departments=JSON.parse(step1[i].departments);
        }
        if(step1[i].disciplines!="" && step1[i].disciplines!="null") {
            step1[i].disciplines=JSON.parse(step1[i].disciplines);
        }
        if(step1[i].faculty_numbers!="" && step1[i].faculty_numbers!="null") {
            step1[i].faculty_numbers=JSON.parse(step1[i].faculty_numbers);
        }
        if(step1[i].g_enroll_header!="" && step1[i].g_enroll_header!="null") {
            step1[i].g_enroll_header=JSON.parse(step1[i].g_enroll_header);
        }
        if(step1[i].g_enroll_phd!="" && step1[i].g_enroll_phd!="null") {
            step1[i].g_enroll_phd=JSON.parse(step1[i].g_enroll_phd);
        }
        if(step1[i].g_enorll_masters!="" && step1[i].g_enorll_masters!="null") {
            step1[i].g_enorll_masters=JSON.parse(step1[i].g_enorll_masters);
        }
        if(step1[i].ug_act!="" && step1[i].ug_act!="null") {
            step1[i].ug_act=JSON.parse(step1[i].ug_act);
        }
        if(step1[i].sat_header!="" && step1[i].sat_header!="null") {
            step1[i].sat_header=JSON.parse(step1[i].sat_header);
        }
        if(step1[i].ug_enroll_fresh!="" && step1[i].ug_enroll_fresh!="null") {
            step1[i].ug_enroll_fresh=JSON.parse(step1[i].ug_enroll_fresh);
        }
        if(step1[i].ug_enroll_header!="" && step1[i].ug_enroll_header!="null") {
            step1[i].ug_enroll_header=JSON.parse(step1[i].ug_enroll_header);
        }
        if(step1[i].ug_enroll_junior!="" && step1[i].ug_enroll_junior!="null") {
            step1[i].ug_enroll_junior=JSON.parse(step1[i].ug_enroll_junior);
        }
        if(step1[i].ug_enroll_sen!="" && step1[i].ug_enroll_sen!="null") {
            step1[i].ug_enroll_sen=JSON.parse(step1[i].ug_enroll_sen);
        }
        if(step1[i].ug_enroll_soph!="" && step1[i].ug_enroll_soph!="null") {
            step1[i].ug_enroll_soph=JSON.parse(step1[i].ug_enroll_soph);
        }
        if(step1[i].ug_sat!="" && step1[i].ug_sat!="null") {
            step1[i].ug_sat=JSON.parse(step1[i].ug_sat);
        }
        console.log(step1[i].ug_tuition)
    }
    console.log(step1)

    //construct new objects and new array
    let step2=[];

    for (let i=0;i<step1.length;i++){
        //get rid of dollar sign anc commas
        let temp=step1[i].g_tuition.replace("$","");
        temp=temp.replace(",","")
        let g_tuition=parseInt(temp);
        let school_description=step1[i].school_description;
        let school_name=step1[i].school_name;
        let school_type=step1[i].school_type;
        let total_g_enrollment=parseInt(step1[i].total_g_enrollment.replace(",",""));
        let total_other_enrollment=parseInt(step1[i].total_other_enrollment.replace(",",""));
        let total_ug_enrollment=parseInt(step1[i].total_ug_enrollment.replace(",",""));
        let ug_enrolled=parseInt(step1[i].ug_enrolled.replace(",",""));
        let ug_number_apps=parseInt(step1[i].ug_number_apps.replace(",",""));
        let ug_number_offered=parseInt(step1[i].ug_number_offered.replace(",",""));

        //get rid of dollar sign anc commas
        temp=step1[i].ug_tuition.replace("$","");
        temp=temp.replace(",","")
        let ug_tuition=parseInt(temp);




        let school={
            g_tuition:g_tuition,
            school_description:school_description,
            school_name:school_name,
            school_type:school_type,
            total_g_enrollment:total_g_enrollment,
            total_other_enrollment:total_other_enrollment,
            total_ug_enrollment:total_ug_enrollment,
            ug_enrolled:ug_enrolled,
            ug_number_apps:ug_number_apps,
            ug_number_offered:ug_number_offered,
            ug_tuition:ug_tuition
        }
        step2.push(school)
    }
    console.log(step2)

}