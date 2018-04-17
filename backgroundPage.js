console.log('backgroundPageJs...');


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//onMessage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    var data = request.data;//var tab = request.tab;
    var tab = sender.tab;
    if (debug) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        console.log('onMessage', 'request', request);
        console.log('onMessage', 'data', data);
        console.log('onMessage', 'tab', tab);
    }

    if (request.type === 'callContentScripts') {
        if (debug) {
            console.log('onMessage', 'callContentScripts');
        }
        chrome.runtime.sendMessage({ data: downloads, type: 'openRedirect' });
    }
    if (request.type === 'openRedirect') {
        if (debug) { console.log('onMessage', 'openRedirect'); }

        openRedirect(request.data, tab);
    }

    if (request.type === "what is my tab_id?") {
        if (debug) { console.log('onMessage', 'what is my tab_id?'); }
        sendResponse({ tab: sender.tab });
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
    //console.log('tab.id', tab.id);
    chrome.tabs.sendMessage(tab.id, { type: 'callContentScripts', tab }, function (response) { });

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
});

function openRedirect(data, ptab) {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }
    var w = 750;
    var h = 750;

    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = screen.width;
    var height = screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    chrome.tabs.create({ url: chrome.extension.getURL('redirect.html'), active: false }, function (tab) {
        // After the tab has been created, open a window to inject the tab
        chrome.windows.create({
            tabId: tab.id, type: 'popup', focused: true,// incognito, top, left, ...
            top: top, left: left, width: w, height: h
        }, function (window) {
            if (debug) {
                console.log('ptab', ptab);
            }
            chrome.runtime.sendMessage({ data, type: 'callRedirect', tab: ptab });
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
