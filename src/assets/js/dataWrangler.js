function Wrangle(data) {
    var self = this;
    self.data=data;
    self.processData=[];
    self.wrangleData();
};





Wrangle.prototype.wrangleData=function(){
    var self=this;
    //console.log(self.data)

    //console.log(typeof self.data[1])
    //consolidate names
    var step1=[];
    var addedNames=[];
    for (var i=0;i<self.data.length;i++){
        if (addedNames.includes(self.data[i].school_name)==false){
            step1.push(self.data[i]);
            addedNames.push(self.data[i].school_name)
        }
    }

    //consolidate data for each school
    for (var j=0;j<step1.length;j++){
        for (var i=0;i<self.data.length;i++) {
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
    for (var i=0;i<step1.length;i++){
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
    }
    //console.log(step1)

    //construct new objects and new array
    var step2=[];
    step1.sort(compare)

    for (var i=0;i<step1.length;i++){
        //get rid of dollar sign anc commas
        var temp=step1[i].g_tuition.replace("$","");
        temp=temp.replace(",","")
        var g_tuition=parseInt(temp);
        var school_description=step1[i].school_description;
        var school_name=step1[i].school_name;
        var school_type=step1[i].school_type;
        var total_g_enrollment=parseInt(step1[i].total_g_enrollment.replace(",",""));
        var total_other_enrollment=parseInt(step1[i].total_other_enrollment.replace(",",""));
        var total_ug_enrollment=parseInt(step1[i].total_ug_enrollment.replace(",",""));
        var ug_enrolled=parseInt(step1[i].ug_enrolled.replace(",",""));
        var ug_number_apps=parseInt(step1[i].ug_number_apps.replace(",",""));
        var ug_number_offered=parseInt(step1[i].ug_number_offered.replace(",",""));

        //get rid of dollar sign anc commas
        temp=step1[i].ug_tuition.replace("$","");
        temp=temp.replace(",","")
        var ug_tuition=parseInt(temp);

        //get ACT scores
        var actMath25="";
        var actMath75="";
        var actComp25="";
        var actComp75="";
        if (step1[i].ug_act!="" && step1[i].ug_act!="null"){
            actMath75=parseInt(step1[i].ug_act[1].ug_act);
            actMath25=parseInt(step1[i].ug_act[2].ug_act);
            actComp75=parseInt(step1[i].ug_act[4].ug_act);
            actComp25=parseInt(step1[i].ug_act[5].ug_act);

        }

        //get SAT scores
        var satMath25="";
        var satMath75="";
        var satRead25="";
        var satRead75="";
        var satWrit25="";
        var satWrit75="";
        var satComb25="";
        var satComb75="";
        if (step1[i].ug_sat!="" && step1[i].ug_act!="null"){
            satMath75=parseInt(step1[i].ug_act[1].ug_sat);
            satMath25=parseInt(step1[i].ug_act[2].ug_sat);
            satRead75=parseInt(step1[i].ug_act[4].ug_sat);
            satRead25=parseInt(step1[i].ug_act[5].ug_sat);
            satWrit75=parseInt(step1[i].ug_act[1].ug_sat);
            satWrit25=parseInt(step1[i].ug_act[2].ug_sat);
            satComb75=parseInt(step1[i].ug_act[4].ug_sat);
            satComb25=parseInt(step1[i].ug_act[5].ug_sat);
        }

        //process undergraduate freshmen enroolement
        //abbriviations
        /*
            M=male
            F=female
            FT=Full_time
            PT=Part_Time
            NA=Nonresident Alien
            U=unknown
            H=Hispanic
            AI=American Indian
            As=Asian
            B=Black
            PI=Pacific Islander
            W=white
            TM=Two or more
            T=Total
        */

        var enroll_fresh=[];
        var enroll_soph=[];
        var enroll_junior=[];
        var enroll_sen=[];
        var enroll_masters=[];
        var enroll_phd=[];

        var enrolls=["ug_enroll_fresh", "ug_enroll_soph", "ug_enroll_junior", "ug_enroll_sen", "g_enorll_masters", "g_enroll_phd"]
        for (var t=0;t<enrolls.length;t++){
            var selection=enrolls[t];
            if(step1[i][selection]!="" && step1[i][selection]!="null" &&step1[i][selection].length>43){
                //clear notes
                for (var j=0;j<step1[i][selection].length;j++){
                    if(step1[i][selection][j][selection].includes("Note:")){
                        step1[i][selection].splice(j,1);
                        j++;
                    }
                }


                for(var k=0;i<step1[i][selection].length;k){
                    if(k<(step1[i][selection].length-21)){
                        //Name of Major
                        var name=step1[i][selection][k+0][selection];
                        //Male statistics
                        var M_NRA_FT=step1[i][selection][k+2][selection];
                        var M_NRA_PT=step1[i][selection][k+3][selection];
                        var M_U_FT=step1[i][selection][k+4][selection];
                        var M_U_PT=step1[i][selection][k+5][selection];
                        var M_H_FT=step1[i][selection][k+6][selection];
                        var M_H_PT=step1[i][selection][k+7][selection];
                        var M_AI_FT=step1[i][selection][k+8][selection];
                        var M_AI_PT=step1[i][selection][k+9][selection];
                        var M_As_FT=step1[i][selection][k+10][selection];
                        var M_As_PT=step1[i][selection][k+11][selection];
                        var M_B_FT=step1[i][selection][k+12][selection];
                        var M_B_PT=step1[i][selection][k+13][selection];
                        var M_PI_FT=step1[i][selection][k+14][selection];
                        var M_PI_PT=step1[i][selection][k+15][selection];
                        var M_W_FT=step1[i][selection][k+16][selection];
                        var M_W_PT=step1[i][selection][k+17][selection];
                        var M_TM_FT=step1[i][selection][k+18][selection];
                        var M_TM_PT=step1[i][selection][k+19][selection];
                        var M_T_FT=step1[i][selection][k+20][selection];
                        var M_T_PT=step1[i][selection][k+21][selection];
                        //Female statistics
                        var F_NRA_FT=step1[i][selection][k+23][selection];
                        var F_NRA_PT=step1[i][selection][k+24][selection];
                        var F_U_FT=step1[i][selection][k+25][selection];
                        var F_U_PT=step1[i][selection][k+26][selection];
                        var F_H_FT=step1[i][selection][k+27][selection];
                        var F_H_PT=step1[i][selection][k+28][selection];
                        var F_AI_FT=step1[i][selection][k+29][selection];
                        var F_AI_PT=step1[i][selection][k+30][selection];
                        var F_As_FT=step1[i][selection][k+31][selection];
                        var F_As_PT=step1[i][selection][k+32][selection];
                        var F_B_FT=step1[i][selection][k+33][selection];
                        var F_B_PT=step1[i][selection][k+34][selection];
                        var F_PI_FT=step1[i][selection][k+35][selection];
                        var F_PI_PT=step1[i][selection][k+36][selection];
                        var F_W_FT=step1[i][selection][k+37][selection];
                        var F_W_PT=step1[i][selection][k+38][selection];
                        var F_TM_FT=step1[i][selection][k+39][selection];
                        var F_TM_PT=step1[i][selection][k+40][selection];
                        var F_T_FT=step1[i][selection][k+41][selection];
                        var F_T_PT=step1[i][selection][k+42][selection];
                        //Build Major
                        var major={
                            name:name,
                            M_NRA_FT:parseInt(M_NRA_FT),
                            M_NRA_PT:parseInt(M_NRA_PT),
                            M_U_FT:parseInt(M_U_FT),
                            M_U_PT:parseInt(M_U_PT),
                            M_H_FT:parseInt(M_H_FT),
                            M_H_PT:parseInt(M_H_PT),
                            M_AI_FT:parseInt(M_AI_FT),
                            M_AI_PT:parseInt(M_AI_PT),
                            M_As_FT:parseInt(M_As_FT),
                            M_As_PT:parseInt(M_As_PT),
                            M_B_FT:parseInt(M_B_FT),
                            M_B_PT:parseInt(M_B_PT),
                            M_PI_FT:parseInt(M_PI_FT),
                            M_PI_PT:parseInt(M_PI_PT),
                            M_W_FT:parseInt(M_W_FT),
                            M_W_PT:parseInt(M_W_PT),
                            M_TM_FT:parseInt(M_TM_FT),
                            M_TM_PT:parseInt(M_TM_PT),
                            M_T_FT:parseInt(M_T_FT),
                            M_T_PT:parseInt(M_T_PT),
                            F_NRA_FT:parseInt(F_NRA_FT),
                            F_NRA_PT:parseInt(F_NRA_PT),
                            F_U_FT:parseInt(F_U_FT),
                            F_U_PT:parseInt(F_U_PT),
                            F_H_FT:parseInt(F_H_FT),
                            F_H_PT:parseInt(F_H_PT),
                            F_AI_FT:parseInt(F_AI_FT),
                            F_AI_PT:parseInt(F_AI_PT),
                            F_As_FT:parseInt(F_As_FT),
                            F_As_PT:parseInt(F_As_PT),
                            F_B_FT:parseInt(F_B_FT),
                            F_B_PT:parseInt(F_B_PT),
                            F_PI_FT:parseInt(F_PI_FT),
                            F_PI_PT:parseInt(F_PI_PT),
                            F_W_FT:parseInt(F_W_FT),
                            F_W_PT:parseInt(F_W_PT),
                            F_TM_FT:parseInt(F_TM_FT),
                            F_TM_PT:parseInt(F_TM_PT),
                            F_T_FT:parseInt(F_T_FT),
                            F_T_PT:parseInt(F_T_PT)
                        }
                    }
                    else if (k<step1[i][selection].length){
                        var name=step1[i][selection][k+0][selection];
                        var T_NRA_FT=step1[i][selection][k+1][selection];
                        var T_NRA_PT=step1[i][selection][k+2][selection];
                        var T_U_FT=step1[i][selection][k+3][selection];
                        var T_U_PT=step1[i][selection][k+4][selection];
                        var T_H_FT=step1[i][selection][k+5][selection];
                        var T_H_PT=step1[i][selection][k+6][selection];
                        var T_AI_FT=step1[i][selection][k+7][selection];
                        var T_AI_PT=step1[i][selection][k+8][selection];
                        var T_As_FT=step1[i][selection][k+9][selection];
                        var T_As_PT=step1[i][selection][k+10][selection];
                        var T_B_FT=step1[i][selection][k+11][selection];
                        var T_B_PT=step1[i][selection][k+12][selection];
                        var T_PI_FT=step1[i][selection][k+13][selection];
                        var T_PI_PT=step1[i][selection][k+14][selection];
                        var T_W_FT=step1[i][selection][k+15][selection];
                        var T_W_PT=step1[i][selection][k+16][selection];
                        var T_TM_FT=step1[i][selection][k+17][selection];
                        var T_TM_PT=step1[i][selection][k+18][selection];
                        var T_T_FT=step1[i][selection][k+19][selection];
                        var T_T_PT=step1[i][selection][k+20][selection];
                        var major={
                            name:name,
                            T_NRA_FT:parseInt(T_NRA_FT),
                            T_NRA_PT:parseInt(T_NRA_PT),
                            T_U_FT:parseInt(T_U_FT),
                            T_U_PT:parseInt(T_U_PT),
                            T_H_FT:parseInt(T_H_FT),
                            T_H_PT:parseInt(T_H_PT),
                            T_AI_FT:parseInt(T_AI_FT),
                            T_AI_PT:parseInt(T_AI_PT),
                            T_As_FT:parseInt(T_As_FT),
                            T_As_PT:parseInt(T_As_PT),
                            T_B_FT:parseInt(T_B_FT),
                            T_B_PT:parseInt(T_B_PT),
                            T_PI_FT:parseInt(T_PI_FT),
                            T_PI_PT:parseInt(T_PI_PT),
                            T_W_FT:parseInt(T_W_FT),
                            T_W_PT:parseInt(T_W_PT),
                            T_TM_FT:parseInt(T_TM_FT),
                            T_TM_PT:parseInt(T_TM_PT),
                            T_T_FT:parseInt(T_T_FT),
                            T_T_PT:parseInt(T_T_PT),
                        }
                    }
                    else{
                        break;
                    }
                    k=k+43;
                    if(selection=="ug_enroll_fresh"){
                        enroll_fresh.push(major);
                    }
                    if(selection=="ug_enroll_soph"){
                        enroll_soph.push(major);
                    }
                    if(selection=="ug_enroll_junior"){
                        enroll_junior.push(major);
                    }
                    if(selection=="ug_enroll_sen"){
                        enroll_sen.push(major);
                    }
                    if(selection=="g_enorll_masters"){
                        enroll_masters.push(major);
                    }
                    if(selection=="g_enroll_phd"){
                        enroll_phd.push(major);
                    }

                }
            }
        }



        var school={
            school_name:school_name,
            g_tuition:g_tuition,
            school_description:school_description,
            school_type:school_type,
            total_g_enrollment:total_g_enrollment,
            total_other_enrollment:total_other_enrollment,
            total_ug_enrollment:total_ug_enrollment,
            ug_enrolled:ug_enrolled,
            ug_number_apps:ug_number_apps,
            ug_number_offered:ug_number_offered,
            ug_tuition:ug_tuition,
            actMath25:actMath25,
            actMath75:actMath75,
            actComp25:actComp25,
            actComp75:actComp75,
            satMath75:satMath75,
            satMath25:satMath25,
            satRead75:satRead75,
            satRead25:satRead25,
            satWrit75:satWrit75,
            satWrit25:satWrit25,
            satComb75:satComb75,
            satComb25:satComb25,
            enroll_fresh:enroll_fresh,
            enroll_soph:enroll_soph,
            enroll_junior:enroll_junior,
            enroll_sen:enroll_sen,
            enroll_masters:enroll_masters,
            enroll_phd:enroll_phd

        }
        step2.push(school)
    }


    self.processData=step2;
    // console.log(self.processData)

}

//source: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const schoolA = a.school_name.toUpperCase();
    const schoolB = b.school_name.toUpperCase();

    let comparison = 0;
    if (schoolA > schoolB) {
        comparison = 1;
    } else if (schoolA < schoolB) {
        comparison = -1;
    }
    return comparison;
}