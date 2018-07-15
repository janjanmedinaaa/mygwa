window.onload = function() {

    chrome.storage.sync.get(['data'], (response) => { 
        var name = document.getElementsByClassName('user-name');
        var degree = document.getElementsByClassName('user-degree');
        var image = document.getElementsByClassName('profile-picture');

        console.log(name, degree, image);

        if(response.data == undefined || response.data == "" || response.data == null){
            name[0].innerHTML = "Hi User!";
            degree[0].innerHTML = "Login first to your MyUSTe Account.";
        }
        else{
            name[0].innerHTML = response.data.name;
            degree[0].innerHTML = response.data.degree;
            image[0].src = response.data.image;
        }
    });
}