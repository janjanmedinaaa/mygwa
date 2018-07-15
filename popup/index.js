window.onload = () => {

    chrome.storage.sync.get(['data'], (response) => { 
        var name = document.getElementsByClassName('user-name');
        var degree = document.getElementsByClassName('user-degree');
        var image = document.getElementById('profile-picture');

        console.log(name, degree, image);

        if(response.data == undefined || response.data == "" || response.data == null){
            name[0].innerHTML = "Hi User!";
            degree[0].innerHTML = "Login first to your MyUSTe Account.";
        }
        else{
            name[0].innerHTML = response.data.name;
            degree[0].innerHTML = response.data.degree;
            image.src = response.data.image;
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
        if (switchToggle.checked == true){
            var msg = {
                type: "pressure-filter-on",
                title: "Turn on Pressure Filter",
                message: "Please turn on Pressure Filter"
            }

            chrome.tabs.query(params, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, msg, (response) => {
                    console.log(response);
                });
            });

        } 
        else {
            var msg = {
                type: "pressure-filter-off",
                title: "Turn off Pressure Filter",
                message: "Please turn off Pressure Filter"
            }

            chrome.tabs.query(params, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, msg, (response) => {
                    console.log(response);
                });
            });
        }

        console.log(switchToggle.checked);
    }
})