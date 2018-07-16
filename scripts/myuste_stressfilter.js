var globalCurrentSem = null;

function validate(input){
    let output = true;

    if(input == undefined || input == "" || input == null){
        output = false;
    }

    return output;
}

function currentSemesterView(){
    let container = document.getElementById('container_body_right');
    let semText = container.childNodes[7].innerHTML;
    let semId = semText.replace("&nbsp;&nbsp;", "").trim();

    return semId;
}

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
    let userData = globalCurrentSem['data']['details']['userData'];

    prelim.innerHTML = userData[c][4];
    final.innerHTML = userData[c][5];
    prelim.style.color = "black";
    final.style.color = "black";
}

function toggleStatus(){
    chrome.storage.sync.get(['toggle'], (response) => {
        if(validate(response.toggle)){
            let status = (response.toggle) ? "on" : "off";
            filterData(dataScrape(), status, globalCurrentSem);
        }
        else{
            chrome.storage.sync.set({toggle: false});
            filterData(dataScrape(), "off", globalCurrentSem);
        }
    });
}

chrome.storage.sync.get(['semviewdetails'], (response) => {
    globalCurrentSem = response.semviewdetails;
});

chrome.storage.sync.get(['semsync'], (response) => {
    let currentsem = currentSemesterView();
    let semsync = response.semsync;

    if(!validate(semsync)){
        chrome.storage.sync.set({semsync: [currentsem]}, () => {
            console.log(currentsem + " added to semsync.");

            let key = currentsem;
            let obj = {};
            obj[key] = globalCurrentSem;

            chrome.storage.sync.set(obj, () => {
                console.log(currentsem + " object created.");
                console.log('add', obj);

                toggleStatus();
            });
        });
    }
    else{
        if(semsync.indexOf(currentsem) < 0){
            semsync.push(currentsem);

            chrome.storage.sync.set({semsync: semsync}, () => {
                console.log(currentsem + " added to semsync.");
    
                let key = currentsem;
                let obj = {};
                obj[key] = globalCurrentSem;
    
                chrome.storage.sync.set(obj, () => {
                    console.log(currentsem + " object created.");
                    console.log('add', obj);

                    toggleStatus();
                });
            });
        }
        else{
            toggleStatus();
        }
    }
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    let messageReturn = null;

    if(message.type == "pressure-filter-on"){
        filterData(dataScrape(), "on", globalCurrentSem);
        messageReturn = true;
    }
    else if(message.type == "pressure-filter-off"){
        filterData(dataScrape(), "off", globalCurrentSem);
        messageReturn = false;
    }

    response(messageReturn);
});
