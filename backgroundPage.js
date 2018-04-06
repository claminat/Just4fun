console.log('backgroundPageJs...');


var socketPromise = new Promise(function (resolve, reject) {
    var socketUrl = 'http://localhost:3002';
    //var socketUrl = 'http://202.143.111.30:3002';
    var socket = io.connect(socketUrl);
    socket.on('connect', function (data) {
        socket.emit('join', 'Hello from Google Ext');
        console.log('Listen socket: ', socketUrl);

        socket.on('broad', function (data) {
            var msg = '[' + new Date().toLocaleString("en-US") + '] Client recieved (broad): ' + data;
            console.log(msg);
        });
        if (socket)
            resolve(socket);
    });
});


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
chrome.contextMenus.create({
    id: 'open',
    title: chrome.i18n.getMessage('openContextMenuTitle'),
    contexts: ["all", "image", "video"]
});




chrome.contextMenus.onClicked.addListener(function (info, tab) {
    var pageUrl = info.pageUrl;
    var srcUrl = info.srcUrl;

    console.log('tab', tab);
    chrome.tabs.create({ url: chrome.extension.getURL('redirect.html'), active: false }, function (tab) {
        console.log('tab->', tab);
        // After the tab has been created, open a window to inject the tab
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true
            // incognito, top, left, ...
        }, function (window) {
            console.log('window->', window);
            chrome.runtime.sendMessage({ data: srcUrl, type: 'request_redirect' });
        });
    });
    
    var rootDomain = extractRootDomain(pageUrl);
   
    if (rootDomain) {
        if (isDomain(pageUrl, "flickr")) {
            closeTab(tab);
            contextMenusFlickr(pageUrl);
        }
        else if (isDomain(pageUrl, "tumblr")) {
            contextMenusTumblr(pageUrl, srcUrl);
        }
        else {
            createNotification('Invalid domain!');
        }
    }
});
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

