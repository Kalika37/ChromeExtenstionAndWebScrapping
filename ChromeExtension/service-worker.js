function ismobile() {
    if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
       a = true ;
    } else {
       a = false ;
    }
    return a;
 }
const user = {
    username: 'demo-user',
    news:{
        description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint quas perferendis ad ratione, inventore doloribus fugit aliquid dolores tempore neque, asperiores nihil! Consequatur, repellendus? Adipisci laborum similique consequatur? Et, consequatur.",
        date:'3rd november 2024',
        title:"nepali news",
        source:{
            title:"kantipur",
            url:"https://kantipur.com"
        }
    },
    status:true
};
chrome.contextMenus.removeAll()
chrome.contextMenus.create(
    { id: Date.now().toString(), title: `Chek if this is a fake News`, contexts: ["selection"] });
chrome.contextMenus.onClicked.addListener((e) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "Context_Menu_clicked"});  
        });

}
)
class SharesTo{

}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    console.log(message)
    if (message.command === 'CheckNewsForthis') {
        // chrome.action.openPopup()
        setTimeout(() => {
            sendResponse(user);
            console.log("sent")
        }, 5000);
        return true
    }
    if (message.command==="ShareResult"){

    }
});
//window.open(`https://wa.me/?text=${text} ${currentUrl}`, '_blank');
//`https://twitter.com/intent/tweet?text=${text}&url=${currentUrl}`
//`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${text}`