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

    return output;
}

function changeProfilePic(image){
    if(location.href == "https://myuste.ust.edu.ph/student/studentcontrol"){
        var myusteImage = document.getElementById('imageholder');
        myusteImage.src = image;
    }
}

function getDetails(){
    var contents = document.getElementsByClassName('sub_content');
    var name = capitalize(contents[2].innerHTML.trim()) + capitalize(contents[1].innerHTML.trim());

    return {
        student_num: contents[0].innerHTML,
        image: document.getElementById('imageholder').src,
        name: name,
        course: contents[18].innerHTML,
        degree: contents[19].innerHTML,
        college: contents[20].innerHTML,
        status: contents[21].innerHTML
    }

}

changeProfilePic('https://pbs.twimg.com/profile_images/1005130124855951360/tBuwWbDx_400x400.jpg');

chrome.storage.sync.get(['data'], (response) => {
    if(response.data == undefined || response.data == "" || response.data == null){
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
    }
});