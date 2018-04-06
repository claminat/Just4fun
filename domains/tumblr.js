function contextMenusTumblr(url, src) {
    var folder = getFolder(url);
    downloadUrl(src, folder);
}

function browserActionTumblr(tab) {
    console.log('------------------------------------------------------------------------------------------------');
    console.log(arguments.callee.name);
    //chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, callbackBrowserAction);
    chrome.tabs.sendMessage(tab.id, { text: 'browserAction' });
}





//function getFolderTumblr(url) {
//    var rootFolder = "tumblr/";
//    var path = rootFolder;
//    var re = new RegExp(/https:\/\/(.*)\.tumblr\.com/);
//    var subFolder = url.match(re).pop();
//    if (subFolder) {
//        path = path + subFolder + "/";
//    }
//    folder= path;
//}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++