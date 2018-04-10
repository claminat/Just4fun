console.log('backgroundPageJs...');


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//onMessage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    console.log('onMessage', 'request', request);
    var data;
    if (request.type === 'callContentScripts') {
        console.log('onMessage', 'callContentScripts');
        data = request.data;
        console.log('data', data);
        chrome.runtime.sendMessage({ data: downloads, type: 'openRedirect' });
        console.log('onMessage', 'callContentScripts', 'end', '------------------------------------------------');
    }
    if (request.type === 'openRedirect') {
        console.log('onMessage', 'openRedirect');
        data = request.data;
        console.log('data', data);
        openRedirect(data);
        console.log('onMessage', 'openRedirect', 'end', '------------------------------------------------');
    }

});


//contextMenus
//#region contextMenus
chrome.contextMenus.create({
    id: 'open',
    title: chrome.i18n.getMessage('openContextMenuTitle'),
    contexts: ["all", "image", "video"]
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log('contextMenus.onClicked', ' start ', '------------------------------------------------');

    chrome.tabs.sendMessage(tab.id, { type: 'callContentScripts' }, function (response) {});

    //var pageUrl = info.pageUrl; console.log('pageUrl', pageUrl);
    //var srcUrl = info.srcUrl; console.log('srcUrl', srcUrl);
    //var title = tab.title;
    //var caption = title.substring(title.lastIndexOf("“") + 1, title.lastIndexOf("”"));
    //var downloadItem = { srcUrl: srcUrl, caption: caption}
    //console.log('tab', tab);
    ////popup redirect
    //if (srcUrl) {
    //    if (checkURL(srcUrl)) {
    //        console.log('downloadItem', downloadItem);
    //        openRedirect(downloadItem);
    //    } else {
    //        createNotification('Invalid Url!');
    //    }
    //}

    ////download
    //var rootDomain = extractRootDomain(pageUrl);
    //if (rootDomain) {
    //    if (isDomain(pageUrl, "flickr")) {
    //        closeTab(tab);
    //        contextMenusFlickr(pageUrl);
    //    }
    //    else if (isDomain(pageUrl, "tumblr")) {
    //        contextMenusTumblr(pageUrl, srcUrl);
    //    }
    //    else {
    //        //createNotification('Invalid Url!');
    //    }
    //}
    console.log('contextMenus.onClicked', '------------------------------------------------');

});

function openRedirect(downloadItem) {
    var w = 750;
    var h = 750;

    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = screen.width; console.log('screenWidth', width);
    var height = screen.height; console.log('screenHeight', height);

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    chrome.tabs.create({ url: chrome.extension.getURL('redirect.html'), active: false }, function (tab) {
        // After the tab has been created, open a window to inject the tab
        chrome.windows.create({
            tabId: tab.id, type: 'popup', focused: true,// incognito, top, left, ...
            top: top, left: left, width: w, height: h
        }, function (window) {
            chrome.runtime.sendMessage({ data: downloadItem, type: 'callRedirect' });
        });
    });
}
//#endregion

//browserAction
//#region browserAction

chrome.browserAction.onClicked.addListener(function (tab) {
    var pageUrl = tab.url;
    var rootDomain = extractRootDomain(pageUrl);
    var done = false;
    if (rootDomain) {
        if (isDomain(pageUrl, "instagram")) {
            done = browserActionInstagram(tab);
        } else if (isDomain(pageUrl, "flickr")) {
            done = browserActionFlickr(tab);
        } else if (isDomain(pageUrl, "tumblr")) {
            done = browserActionTumblr(tab);
        } else {
            createNotification('Invalid domain!', icon32);
        }
        if (done) {

        }
        closeTab(tab);

    }
});

//#endregion

//onDeterminingFilename
//#region onDeterminingFilename
//var rulesets = {};
//chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
//    console.log('-------------------------------------------------------------------------------');
//    console.log(chrome.downloads.onDeterminingFilename.addListener);
//    console.log(item);
//    console.log(suggest);
//    var src = item.url;
//    var rootDomain = extractRootDomain(src);
//    console.log('rootDomain', rootDomain); 
//    if (isDomain(src, "instagram") | isDomain(src, "flickr") | isDomain(src, "tumblr") ) {


//    }


//    //rulesets["hostname"](item, suggest);
//    return true;
//});

////config directory download
//rulesets["hostname"] = function (item, suggest) {
//    var folder = '';
//    suggest({
//        filename: folder + item.filename,
//        conflict_action: 'overwrite',
//        conflictAction: 'overwrite'
//    });
//}

//#endregion
