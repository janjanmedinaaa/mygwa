function notif(title, message){
    var params = {
        type: "basic",
        iconUrl: "../assets/notif_icon_v3_2.png",
        title: title,
        message: message
    }

    chrome.notifications.create(params);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type == "notification"){
        notif(message.title, message.message);
    }
});