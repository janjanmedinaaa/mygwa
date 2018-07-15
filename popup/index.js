window.onload = () => {
    var switchToggle = document.getElementById('switch');

    function validate(input){
        let output = true;
    
        if(input == undefined || input == "" || input == null){
            output = false;
        }
    
        return output;
    }

    chrome.storage.sync.get(['data', 'toggle'], (response) => { 
        var name = document.getElementsByClassName('user-name');
        var degree = document.getElementsByClassName('user-degree');
        var image = document.getElementById('profile-picture');

        console.log(name, degree, image);

        if(!validate(response.data)){
            name[0].innerHTML = "Hi User!";
            degree[0].innerHTML = "Login first to your MyUSTe Account.";
        }
        else{
            name[0].innerHTML = response.data.name;
            degree[0].innerHTML = response.data.degree;
            image.src = response.data.image;
        }

        if(!validate(response.toggle)){
            chrome.storage.sync.set({toggle: false})
        }
        else{
            switchToggle.checked = response.toggle;
        }
    });
}

window.addEventListener('load', () => {
    var switchToggle = document.getElementById('switch');

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
})