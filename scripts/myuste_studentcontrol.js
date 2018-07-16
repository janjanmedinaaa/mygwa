function validate(input){
    let output = true;

    if(input == undefined || input == "" || input == null){
        output = false;
    }

    return output;
}

function sendMessageNotif(title, message){
    chrome.runtime.sendMessage({type: "notification", title: title, message: message});
}

function capitalize(input){
    var output = "";
    var splitWords = input.split(" ");
    var length = input.length;

    for(var a = 0; a < splitWords.length; a++){
        var first = (splitWords[a].substring(0,1)).toUpperCase(),
        second = (splitWords[a].substring(1,length)).toLowerCase();

        output += first + second + " ";
    }

    return output.trim();
}

function changeProfilePic(image){
    if(location.href == "https://myuste.ust.edu.ph/student/studentcontrol"){
        var myusteImage = document.getElementById('imageholder');
        myusteImage.src = image;
    }
}

function getDetails(){
    var contents = document.getElementsByClassName('sub_content');
    var name = capitalize(contents[2].innerHTML.trim() + " " + contents[1].innerHTML.trim());

    return {
        student_num: contents[0].innerHTML.trim(),
        image: document.getElementById('imageholder').src,
        name: name,
        course: capitalize(contents[18].innerHTML),
        degree: capitalize(contents[19].innerHTML),
        college: capitalize(contents[20].innerHTML),
        status: capitalize(contents[21].innerHTML)
    }

}

chrome.storage.sync.get(['data'], (response) => {
    if(!validate(response.data)){
        chrome.storage.sync.set({data: getDetails()}, () => {
            sendMessageNotif(
                "MyUSTe Data Saved", 
                "Your data has been saved. You're the only one who can access your data."
            );
        });
    }
    else{
        var title = `Welcome back ${response.data.name}!`;
        sendMessageNotif(title, "You did great this semester! Just relax :)");

        changeProfilePic(response.data.image);
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    //ONLY THE IMAGE UPDATES FOR NOW
    changeProfilePic(changes.data.newValue.image);
})


// chrome.storage.sync.clear();