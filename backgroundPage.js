console.log('backgroundPageJs...');


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
chrome.contextMenus.create({
    id: 'open',
    title: chrome.i18n.getMessage('openContextMenuTitle'),
    contexts: ["all", "image", "video"]
});

chrome.runtime.onMessage.addListener(function (request) {
    console.log('request', 'openRedirect', request);
    if (request.type === 'openRedirect') {
        var data = request.data; console.log('data', data);
        var srcUrl = data.downloadItem.url; console.log('srcUrl', srcUrl);

        //chrome.tabs.create({ url: chrome.extension.getURL('redirect.html'), active: false }, function (tab) {
        //    chrome.windows.create({// After the tab has been created, open a window to inject the tab
        //        tabId: tab.id,type: 'popup',focused: true // incognito, top, left, ...
        //    }, function (window) {
        //        chrome.runtime.sendMessage({ data: srcUrl, type: 'callRedirect' });
        //    });
        //});
    }
    console.log('request', 'openRedirect', '------------------------------------------------');
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log('contextMenus.onClicked');
    var pageUrl = info.pageUrl; console.log('pageUrl', pageUrl);
    var srcUrl = info.srcUrl; console.log('srcUrl', srcUrl);
    var title = tab.title;
    var caption = title.substring(title.lastIndexOf("“") + 1, title.lastIndexOf("”"));
    var downloadItem = { srcUrl: srcUrl, caption: caption}
    console.log('tab', tab);
    //popup redirect
    if (srcUrl) {
        if (checkURL(srcUrl)) {
            console.log('downloadItem', downloadItem);
            openRedirect(downloadItem);
        } else {
            createNotification('Invalid Url!');
        }
    }

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
    var w = 400;
    var h = 400;

    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = screen.width; console.log('screenWidth', width);
    var height = screen.height; console.log('screenHeight', height);

    //var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    //var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;


    ////var width = $(this).width(); console.log('width', width);
    ////var height = $(this).height(); console.log('height', height);

    

    //var left = ((screenWidth / 2) - (w / 2)) ;
    //var top = ((screenHeight / 2) - (h / 2));

    chrome.tabs.create({ url: chrome.extension.getURL('redirect.html'), active: false }, function (tab) {
        // After the tab has been created, open a window to inject the tab
        chrome.windows.create({
            tabId: tab.id, type: 'popup', focused: true,// incognito, top, left, ...
            top:top,left:left,width:w,height:h
        }, function (window) {
            chrome.runtime.sendMessage({ data: downloadItem, type: 'callRedirect' });
        });
    });
}




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
////++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

