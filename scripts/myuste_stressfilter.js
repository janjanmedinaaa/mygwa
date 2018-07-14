function stressFilter(){
    var tables = document.getElementsByTagName('table');
    var gradesTableId = null;

    var tableFinalData = [],
        tableTr = [];

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

    for(var c = 1; c < tableTr.length; c++){
        var tableTd = [];
        var d = 4;
        
        while(d < tableTr[c]['children'].length){
            var prelim = tableTr[c]['children'][d].innerHTML;
            var final = tableTr[c]['children'][d+1].innerHTML;

            tableTd.push(prelim, final);

            //4, 10, 16, 22
            if(parseInt(prelim) >= 75){
                tableTr[c]['children'][d].innerHTML = "PASSED";
                tableTr[c]['children'][d].style.color = "green";
            }
            else if(prelim === "&nbsp;"){
                tableTr[c]['children'][d].innerHTML = "NO GRADE";
            }
            else{
                tableTr[c]['children'][d].innerHTML = "FAILED";
                tableTr[c]['children'][d].style.color = "red";
            }

            if(parseFloat(final) <= 3.0){
                tableTr[c]['children'][d+1].innerHTML = "PASSED";
                tableTr[c]['children'][d+1].style.color = "green";
            }
            else if(final === "&nbsp;"){
                tableTr[c]['children'][d+1].innerHTML = "NO GRADE";
            }
            else{
                tableTr[c]['children'][d+1].innerHTML = "FAILED";
                tableTr[c]['children'][d+1].style.color = "red";
            }

            d += 6;
        }

        tableFinalData.push(tableTd);
    }

    return tableFinalData;
}

console.log(stressFilter());