function dataScrape(){
    let tables = document.getElementsByTagName('table');
    let gradesTableId = null;

    let tableFinalData = [],
        tableTr = [];

    for(let a = 0; a < tables.length; a++){
        if(tables[a].id != "sysem_list" && tables[a].id != "grades_table" && tables[a].id != ""){
            gradesTableId = a;
        }
    }

    let tableInitialData = tables[gradesTableId].rows;
    let tableDataLength = tableInitialData.length;

    for(let b = 0; b < tableDataLength; b++){
        tableTr.push(tableInitialData[b]);
    }

    for(let c = 0; c < tableTr.length; c++){

        let tableTd = [];
        for(let d = 0; d < tableTr[c]['children'].length; d++){
            tableTd.push(tableTr[c]['children'][d].innerHTML);
        }

        tableFinalData.push(tableTd);
    }

    return tableFinalData;
}

function getSemGrades(userData){
    let notCounted = ["PE", "NSTP CWS 1", "NSTP CWS 2"];

    let preGrades = [],
        finGrades = [],
        subjects = [];

    let totalUnits = 0;

    //GET PRELIMS AND FINALS
    for(let e = 1; e < userData.length; e++){
        let subjCode = userData[e][0];
        let subjName = userData[e][1];
        let subjUnits = parseInt(userData[e][2]) + parseInt(userData[e][3]);
        let prelimScore = parseInt(userData[e][4]);
        let finalScore = parseFloat(userData[e][5]);

        if(notCounted.indexOf(subjCode) < 0){
            subjects.push([subjCode, subjName]);
            preGrades.push([subjUnits, prelimScore]);
            finGrades.push([subjUnits, finalScore]);

            totalUnits += subjUnits;
        }
    }

    return {
        userData: userData,
        preGrades: preGrades,
        finGrades: finGrades,
        subjects: subjects,
        units: totalUnits
    }
}

function computeGrade(details){
    let prelims = 0, finals = 0;

    let preGrades = details.preGrades,
        finGrades = details.finGrades,
        units = details.units,
        subjects = details.subjects;

    for(let a = 0; a < subjects.length; a++){
        prelims += preGrades[a][0] * preGrades[a][1];
        finals += finGrades[a][0] * finGrades[a][1];
    }

    return {
        details: details,
        prelims: finalGradeCheck(prelims, units),
        finals: finalGradeCheck(finals, units)
    }
}

function finalGradeCheck(grade, units){
    return ((!isNaN(grade) && grade != 0)) ? grade / units : "No Grades Posted yet.";
}

function GPA(grade){
    let GPA = 0.00;
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

function getSemester(){
    let atags = document.getElementsByTagName('a');
    let aSemesters = [];

    for(let a = 0; a < atags.length; a++){
        if(atags[a].id == "link_style1"){
            let children = atags[a]['children'];
            let inner = children[0].innerHTML;

            aSemesters.push(fixSemName(inner));
        }
    }

    return aSemesters;
}

function fixSemName(semName){
    let length = semName.length;
    let firstCut = semName.substring(0, 5);
    let secondCut = semName.substring(5, length);

    return firstCut + "20" + secondCut;
}

function semDetails(){
    let container = document.getElementById('container_body_right');
    let semText = container.childNodes[7].innerHTML;
    let semId = semText.replace("&nbsp;&nbsp;", "").trim();

    return {
        semId: semId,
        data: computeGrade(getSemGrades(dataScrape()))
    }
}

console.log(semDetails());
