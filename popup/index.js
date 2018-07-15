window.onload = () => {
    var switchToggle = document.getElementById('switch');

    function validate(input){
        let output = true;
    
        if(input == undefined || input == "" || input == null){
            output = false;
        }
    
        return output;
    }

    chrome.storage.sync.get(['data', 'semesters', 'semsync'], (response) => { 
        var name = document.getElementsByClassName('user-name');
        var degree = document.getElementsByClassName('user-degree');
        var image = document.getElementById('profile-picture');
        var insync = document.getElementById('insync');

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

            chrome.storage.sync.set({data: response.data});
            image.src = input;
        });
    }
})