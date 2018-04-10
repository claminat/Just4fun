var debug = false;
//debug = true;

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length; //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]; //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 1].length == 2 && splitArr[arrLen - 1].length === 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function extractHostname(url) {
    var hostname; //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    } //find & remove port number
    hostname = hostname.split(':')[0]; //find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}

function clickDownloadUrl(url) {
    var download = document.createElement('a');
    download.href = url;
    download.download = '';
    download.click();
}


function downloadUrl(url, folder) {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
        console.log(folder);
        console.log(url);
        var arrayUrl = url.split('/');
        var filename = arrayUrl[Object.keys(arrayUrl).pop()];
        console.log('folder', folder);
        console.log('url', url); 
        console.log('filename', filename); 
        var path = folder + filename;
        console.log('path', path); 
        chrome.downloads.download({ url: url, filename: path, conflictAction: 'overwrite' });
        console.log("Successful match");
    } else {
        console.log("No match");
    }
}
function getElementByXPath(xpath, parent) {
    return document.evaluate(xpath, parent, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//domain url
function getDomainInfo(url) {
    if (!url) {
        var arrValue = url.split("//");
        if (arrValue.length > 0) {
            var domain = arrValue[1].split(".");
            return domain;
        }
    }
    //return null;
}
function GetURLParameter(url, sParam) {
    //var sPageURL = window.location.search.substring(1);
    var sPageURL = url.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}


function isDomain(url, domain) {
    if (url) {
        if (domain) {
            if (url.match(domain)) {
                return true;
            }
        }
    }
    return false;
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//tab
function closeCurrentTab() {
    chrome.tabs.getSelected(null, function (tab) {
        closeTab(tab);
    });
}
function closeTab(tab) {
    if (tab) {
        chrome.tabs.remove(tab.id, function () { });
    }
}
//notification
function createNotification(message, iconUrl) {
    var icon;
    if (iconUrl)
        icon = iconUrl;
    else
        icon = 'icons/favorites512.png';
    chrome.notifications.create({
        type: 'basic',
        iconUrl: icon,//iconUrl: 'icons/favorites512.png',
        title: 'Just4fun',
        message: message,
        buttons: [
            { title: 'Keep it Flowing.' }
        ],
        priority: 0
    });
}

function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
        if (el.tagName === "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,//left
        y: yPos//top
    };
}

//string
function has(str,txt) {
    if (str.indexOf(txt) >= 0) {
        return true;
    } else {
        return false;
    }
}


//valid
function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}


//encode & decode

function encodeData(s){
    return encodeURIComponent(s).replace(/\-/g, "%2D").replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
}