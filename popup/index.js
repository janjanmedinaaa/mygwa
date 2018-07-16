window.onload = () => {
    function overallGrade(semsync){
        var overall = document.getElementById('overall');
        var length = semsync.length;
        var unitsTotal = 0.00,
            semTotal = 0.00;

        for(let a = 0; a < length; a++){
            chrome.storage.sync.get([semsync[a]], (response) => {
                let units = response[semsync[a]]['data']['details']['units'];
                let finalGrade = response[semsync[a]]['data']['finals'];

                if(finalGrade != "No Grades Posted yet."){
                    finalGrade = parseFloat(finalGrade);

                    semTotal += parseFloat((finalGrade * units).toFixed(2));
                    unitsTotal += (units);
                    
                    overall.innerHTML = (parseFloat(semTotal)/ parseFloat(unitsTotal)).toFixed(2);
                }
            });
        }
    }
    
    function validate(input){
        let output = true;
    
        if(input == undefined || input == "" || input == null){
            output = false;
        }
    
        return output;
    }

    chrome.storage.sync.get(['data', 'semesters', 'semsync', 'semview', 'toggle'], (response) => { 
        var name = document.getElementsByClassName('user-name');
        var degree = document.getElementsByClassName('user-degree');
        var image = document.getElementById('profile-picture');
        var insync = document.getElementById('insync');
        var semestral = document.getElementById('semestral');
        var switchToggle = document.getElementById('switch');

        switchToggle.checked = (response.toggle);
        

        if(!validate(response.data)){
            name[0].innerHTML = "Hi User!";
            degree[0].innerHTML = "Login first to your MyUSTe Account.";
        }
        else{
            name[0].innerHTML = response.data.name;
            degree[0].innerHTML = response.data.degree;
            image.src = response.data.image;
        }

        if(validate(response.semesters)){
            insync.innerHTML = response.semsync.length + "/" + response.semesters.length;
            overallGrade(response.semsync);
        }
        
        if(validate(response.semview)){
            let currentsemview = response.semview;

            chrome.storage.sync.get([currentsemview], (response) => {
                let finals = response[currentsemview]['data']['finals'];

                if(finals == "No Grades Posted yet."){
                    semestral.innerHTML = finals;
                    semestral.style.fontSize = 13;
                }
                else{
                    semestral.innerHTML = finals.toFixed(2);
                }
            });
        }
    });
}

window.addEventListener('load', () => {
    var switchToggle = document.getElementById('switch');
    var urlImageInput = document.getElementById('urlimage');
    var image = document.getElementById('profile-picture');

    var params = {
        active: true,
        currentWindow: true,
    }

    switchToggle.onclick = function() {
        chrome.tabs.query(params, (tabs) => {
            var msg = {
                title: "Turn on Pressure Filter",
                message: "Please turn on Pressure Filter"
            }

            msg['type'] = switchToggle.checked ? "pressure-filter-on" : "pressure-filter-off";

            chrome.tabs.sendMessage(tabs[0].id, msg, (response) => {
                syncToggle(response);
            });
        });
    }

    function syncToggle(status){
        chrome.storage.sync.set({toggle: status});
    }

    urlImageInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            updateURLImage(urlImageInput.value);
        }
    });

    function updateURLImage(input) {
        chrome.storage.sync.get(['data'], (response) => {
            response['data']['image'] = input;
            var msg = {
                type: "icon_notification",
                title: "Icon Changed",
                message: "Your look good here!"
            }

            chrome.runtime.sendMessage(msg);
            chrome.storage.sync.set({data: response.data});
            image.src = input;
        });
    }
})