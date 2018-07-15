function dataScrape(){
    let tables = document.getElementsByTagName('table');
    let gradesTableId = null;
    let tableTr = [];

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

    return tableTr;
}

function filterData(tableTr, status){
    for(var c = 1; c < tableTr.length; c++){
        var d = 4;
        
        while(d < tableTr[c]['children'].length){
            var prelim = tableTr[c]['children'][d];
            var final = tableTr[c]['children'][d+1];

            (status == "on") ? filter(prelim, final) : unfilter(prelim, final, c);

            d += 6;
        }
    }
}

function filter(prelim, final){
    if(parseInt(prelim.innerHTML) >= 75){
        prelim.innerHTML = "PASSED";
        prelim.style.color = "green";
    }
    else if(prelim.innerHTML === "&nbsp;"){
        prelim.innerHTML = "NO GRADE";
    }
    else{
        prelim.innerHTML = "FAILED";
        prelim.style.color = "red";
    }

    if(parseFloat(final.innerHTML) <= 3.0){
        final.innerHTML = "PASSED";
        final.style.color = "green";
    }
    else if(final.innerHTML === "&nbsp;"){
        final.innerHTML = "NO GRADE";
    }
    else{
        final.innerHTML = "FAILED";
        final.style.color = "red";
    }
}

function unfilter(prelim, final, c){
    let currentsem = currentSemesterView();

    chrome.storage.sync.get([currentsem], (response) => {
        let userData = response[currentsem]['data']['details']['userData'];

        prelim.innerHTML = userData[c][4];
        final.innerHTML = userData[c][5];
        prelim.style.color = "black";
        final.style.color = "black";
    })
}

function currentSemesterView(){
    let container = document.getElementById('container_body_right');
    let semText = container.childNodes[7].innerHTML;
    let semId = semText.replace("&nbsp;&nbsp;", "").trim();

    return semId;
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    let messageReturn = null;

    if(message.type == "pressure-filter-on"){
        filterData(dataScrape(), "on");
        messageReturn = true;
    }
    else if(message.type == "pressure-filter-off"){
        filterData(dataScrape(), "off");
        messageReturn = false;
    }

    response(messageReturn);
});

chrome.storage.sync.get(['toggle'], (response) => {
    let status = (response.toggle) ? "on" : "off";
    filterData(dataScrape(), status);
});
