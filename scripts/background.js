console.log("background running");
function notif(title, message){
    var params = {
        type: "basic",
        iconUrl: "../assets/notif_icon2.png",
        title: title,
        message: message
    }

    chrome.notifications.create(params);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type == "notification" || message.type == "icon_notification"){
        notif(message.title, message.message);
    }
});