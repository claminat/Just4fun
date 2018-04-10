
//onMessage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (debug) { console.log('onMessage', 'request', request, '------------------------------------------------');}
    if (request.type === 'download') {
        var download = request.data;console.log('download', download);
        if (download) {
            console.log('download.url', download.url); 
            console.log('download.folder', download.folder); 
            downloadUrl(download.url, download.folder);
        }
    }
    if (request.type === 'downloads') {
        var downloads = request.data; console.log('downloads', downloads);
        if (downloads) {
            downloads.map(function (download) {
                console.log('download', download);
                if (download) {
                    console.log('download.url', download.url);
                    console.log('download.folder', download.folder);
                   
                    downloadUrl(download.url, download.folder);
                }
            });
        }
    }
});


// A function to use as callback
function callbackBrowserAction(downloads) {
    console.log(arguments.callee.name, '------------------------------------------------');
    if (downloads) {
        console.log('downloads'); console.log(downloads);
        $.each(downloads, function (index, download) {
            console.log('download.url'); console.log(download.url);
            console.log('download.folder'); console.log(download.folder);
            if (download)
                downloadUrl(download.url, download.folder);
        });
    } else {
        console.log('Ăn lồn con đĩ.');
    }
}



function getFolder(pageUrl) {
    console.log(arguments.callee.name, '------------------------------------------------');
    var rootDomain = extractRootDomain(pageUrl);
    if (rootDomain) {
        var rootFolder;
        var arrayUrl;
        var subFolder;
        var folder;
        if (isDomain(pageUrl, "instagram")) {
            rootFolder = "instagram/";
            arrayUrl = pageUrl.split('/');
            console.log(arrayUrl);
            subFolder = arrayUrl[5].split('=')[1] + '/';
            console.log(subFolder);//console.log(subFolder);
            folder = rootFolder + subFolder;//console.log(folder);
            return folder;
        } else if (isDomain(pageUrl, "flickr")) {
            //
        } else if (isDomain(pageUrl, "tumblr")) {
            rootFolder = "tumblr/";
            arrayUrl = pageUrl.split('/'); //console.log(arrayUrl);
            subFolder = arrayUrl[2].split('.')[0] + '/'; //console.log(subFolder);
            folder = rootFolder + subFolder;
            console.log('folder', folder);//console.log(folder);
            return folder;
        } else {
            var infoUrl = deconstructURL(pageUrl);
            console.log('cUrlcUrl', infoUrl);
            folder = infoUrl.hostname;
            return folder;
        }
        return '';
    }
    return '';
}



function xxxRegexxx(url) {
    var rootFolder = "instagram/";
    var path = rootFolder;
    var regexMain = new RegExp(/\?taken-by=(.*)/);
    var regexSub = new RegExp(/https:\/\/www.instagram.com\/(.*)/);
    if (url.match(regexMain)) {
        path = path + url.match(regexMain).pop() + "/";
    } else if (url.match(regexSub)) {
        path = path + url.match(regexSub).pop();
    }
    return path;
}