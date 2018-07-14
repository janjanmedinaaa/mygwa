//GWA CALCU
function GWACalcu(){
    var tables = document.getElementsByTagName('table');
    var notCounted = ["PE", "NSTP CWS 1", "NSTP CWS 2"];
    var gradesTableId = null;

    var preGrades = [],
        finGrades = [],
        tableFinalData = [],
        tableTr = [],
        subjects = [],
        countedSubjects = [];

    var units, totalUnits = 0,
        GWAInitialPre = 0,
        GWAInitialFin = 0;

    for(var a = 0; a < tables.length; a++){
        if(tables[a].id != "sysem_list" && tables[a].id != "grades_table" && tables[a].id != ""){
            gradesTableId = a;
        }
    }

    var tableInitialData = tables[gradesTableId].rows;
    var tableDataLength = tableInitialData.length;

    for(var b = 0; b < tableDataLength; b++){
        tableTr.push(tableInitialData[b]);
    }

    for(var c = 0; c < tableTr.length; c++){

        var tableTd = [];
        for(var d = 0; d < tableTr[c]['children'].length; d++){
            tableTd.push(tableTr[c]['children'][d].innerHTML);
        }

        tableFinalData.push(tableTd);
    }

    //PRELIMS (MOSTLY RAW GRADE NILALAGAY)
    for(var e = 1; e < tableFinalData.length; e++){
        subjects.push([tableFinalData[e][0], tableFinalData[e][1]]);
        units = (parseInt(tableFinalData[e][2]) + parseInt(tableFinalData[e][3]));
        var subjGradePre = (units * parseInt(tableFinalData[e][4]));
        preGrades.push([units, parseFloat(tableFinalData[e][4])]);

        if(notCounted.indexOf(tableFinalData[e][0]) < 0){
            totalUnits += units;
        }

        if(!isNaN(subjGradePre) && notCounted.indexOf(tableFinalData[e][0]) < 0){
            GWAInitialPre += subjGradePre;
        }
    }

    totalUnits = 0;
    //FINALS (MOSTLY YUNG PINAKAFINAL TALAGA)
    for(var f = 1; f < tableFinalData.length; f++){
        units = (parseInt(tableFinalData[f][2]) + parseInt(tableFinalData[f][3]));
        var subjGradeFin = (units * parseFloat(tableFinalData[f][5]));
        finGrades.push([units, parseFloat(tableFinalData[f][5])]);

        if(notCounted.indexOf(tableFinalData[f][0]) < 0){
            totalUnits += units;
            countedSubjects.push([tableFinalData[f][0], tableFinalData[f][1]]);
        }

        if(!isNaN(subjGradeFin) && notCounted.indexOf(tableFinalData[f][0]) < 0){
            GWAInitialFin += subjGradeFin;
        }
    }

    GWAPre = ((!isNaN(GWAInitialPre) && GWAInitialPre != 0)) 
            ? GWAInitialPre / totalUnits : 
            "No Grades Posted yet.";

    GWAFin = ((!isNaN(GWAInitialFin) && GWAInitialFin != 0)) 
            ? GWAInitialFin / totalUnits : 
            "No Grades Posted yet.";

    return {
        Prelims: GWAPre,
        Finals: GWAFin,
        Units: totalUnits,
        PrelimGrades: preGrades,
        FinalGrades: finGrades,
        Subjects: subjects,
        countedSubjects: countedSubjects                                                              
    };
}

function GPA(grade){
    var GPA = 0.00;
    grade = Math.round(grade);
    
    switch (true){
        case (grade >= 96):
            GPA = 1.00;
            break;
        case (grade >= 94):
            GPA = 1.25
            break;
        case (grade >= 92):
            GPA = 1.50;
            break;
        case (grade >= 89):
            GPA = 1.75
            break;
        case (grade >= 87):
            GPA = 2.00;
            break;
        case (grade >= 84):
            GPA = 2.25
            break;
        case (grade >= 82):
            GPA = 2.50;
            break;
        case (grade >= 79):
            GPA = 2.75
            break;
        case (grade >= 75):
            GPA = 3.00;
            break;
        case (grade < 75):
            GPA = 5.00;
            break;
    }

    return GPA;
}

console.log(GWACalcu());
