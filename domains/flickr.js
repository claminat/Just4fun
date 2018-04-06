// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//https://www.flickr.com/services/apps/by/147967616@N05
//Key:081951b4355236ccf9041f51b2427abb
var api_key = '66fb51183c3d911a8048697ad682265e'
//Secret:c1ab6788ec4eea21
const apiUrl = "https://api.flickr.com/services/rest/?method=";
const apiKeyParam = "&api_key=0381296ffa92ae62d6f5b889e6e41085&format=json&nojsoncallback=1";

/**
 *
 * @param query
 * @param successCallback
 * @param failCallback
 */

function browserActionFlickr(tab) {
    var pageUrl = tab.url;
    //processImage(pageUrl);
    var arrayUrl = pageUrl.split('/'); console.log(arrayUrl);
    var folderFlickr = arrayUrl[4]; console.log('folderFlickr', folderFlickr);
    var photoId = arrayUrl[5]; console.log('photoId', photoId);
    var urlGetSizes = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + photoId + "&format=json&nojsoncallback=1";
    $.getJSON(urlGetSizes, function (items) {
        console.log('------------------------------------------------');
        console.log('items'); console.log(items);
        //var highest = items.sizes.size[Object.keys(items.sizes.size).pop()];
        var src = items.sizes.size[Object.keys(items.sizes.size).pop()].source;
        console.log('src'); console.log(src);
        var folder = 'flickr/' + folderFlickr + '/';
        console.log('folder'); console.log(folder);
        downloadUrl(src, folder);

    });
}
//
function getFolderFlickr(url) {
    var rootFolder = 'flickr/';
    var path = rootFolder;
    var regexMain = new RegExp(/flickr.com\/photos\/(.*)\/[0-9]/);
    if (url.match(regexMain)) {
        console.log(url.match(regexMain))
        var subFolder = url.match(regexMain).pop();
        path = path + subFolder + "/";
    }
    return path;
}
//multi
function contextMenusFlickr(url) {
    getPhotoSetId(url).then((photoset_id) => {
        return getPhotos(photoset_id);
    });
}
function getPhotoSetId(url) {
    return new Promise(function (resolve, reject) {
        if (url) {
            var array = url.split('/');
            var photoset_id = array[6];
            resolve(photoset_id);
        } else {
            var reason = new Error(arguments.callee.toString() + ' is not happy');
            reject(reason);
        }
    });
}

function getPhotos(photoset_id) {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);

    if (photoset_id) {
        var urlSrc = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" +
            api_key +
            "&photoset_id=" +
            photoset_id +
            "&format=json&nojsoncallback=1";

        $.getJSON(urlSrc, function (photosets) {
            console.log('photosets: '); console.log(photosets);
            var total = photosets.photoset.total;
            var pages = photosets.photoset.pages;
            console.log('pages'); console.log(pages);
            var items = [];
            if (pages == 1) {
                getInfos(photosets);
            } else {
                var values = [];
                for (i = 1; i <= pages; i++) {
                    var page = i;
                    var perPage = 500;
                    var urlSrc =
                        "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" + api_key +
                        "&photoset_id=" + photoset_id +
                        "&per_page=" + perPage +
                        "&page=" + page +
                        "&format=json&nojsoncallback=1";
                    $.getJSON(urlSrc, function (data) {
                        createNotification('Download complete!', icon32);
                        //values.push(data);
                        return data;
                    }).then(function (data) {
                        getInfos(data);
                    });
                }

            }
        });
    }
}

function getInfos(photosets) {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
    if (photosets.stat = "ok") {
        $.each(photosets.photoset.photo, function (index, photoset) {
            var urlSrc = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + api_key +
                "&photo_id=" + photoset.id + "&format=json&nojsoncallback=1";
            $.getJSON(urlSrc, function (info) {
                var photo = info.photo;
                var farm = photo.farm;
                var id = photo.id;
                var server = photo.server;
                var secret = photo.secret;
                var originalsecret = photo.originalsecret;
                var originalformat = photo.originalformat;
                var path_alias = photo.owner.path_alias;
                //
                var ownername = photosets.ownername;
                var title = photosets.photoset.title;
                var rootFolder = 'flickr/';
                var folderFlickr = rootFolder + path_alias + '/' + title + '/';
                // //var src = "https://farm" + farm + ".staticflickr.com/" + server + "/" + id + "_" + originalsecret + "_o." + originalformat
               
                //downloadUrl(src, '/xiao/qing/set/');
                var urlGetSizes = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + id + "&format=json&nojsoncallback=1"
                $.getJSON(urlGetSizes, function (items) {
                    console.log('------------------------------------------------');
                    return items;

                }).then(function (items) {
                    console.log('photosets'); console.log(photosets);
                    console.log('items'); console.log(items);
                    //var highest = items.sizes.size[Object.keys(items.sizes.size).pop()];
                    var src = items.sizes.size[Object.keys(items.sizes.size).pop()].source;
                    console.log('source'); console.log(src);
                    var arrayUrl = src.split('/');
                    var filename = arrayUrl[Object.keys(arrayUrl).pop()];
                    console.log('filename'); console.log(filename);
                    var folder = folderFlickr + filename;
                    console.log('folder'); console.log(folder);
                    downloadUrl(src, folder);

                });
            });
        });

    }
}


//flickr.photosets.getPhotos
//https://www.flickr.com/services/api/flickr.photosets.getPhotos.html


//flickr.photos.getInfo
//https://www.flickr.com/services/api/explore/flickr.photos.getInfo
//https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=11668a7a628836e63418633cbacc29ba&photo_id=35062926302&format=json&nojsoncallback=1

//flickr.photos.getSizes
//https://www.flickr.com/services/api/flickr.photos.getSizes.html
//https://www.flickr.com/services/api/explore/flickr.photos.getSizes

//
//https://www.flickr.com/services/api/misc.urls.html
//https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


var totalRequest = 0;
function sendRequest(option) {
    $.ajax({
        url: apiUrl + option.query + apiKeyParam,
        dataType: "json",
        global: option.global,
        success: function (response) {
            if (option.onSuccess && typeof (option.onSuccess) === "function") {
                option.onSuccess(response);
            }
        },
        fail: function () {
            if (option.onFail && typeof (option.onFail) === "function") {
                option.onFail(response);
            }
        }

    });
}


/*
 * @ param
 *  sizes array of size : { "label": "[String]", "width": [int], "height": [int], "source": "[url]", "url": "[URL]", "media": "[photo|video]" },
 */
function getLastPhoto(sizes) {
    var result = "";
    var photos = "";
    $.each(sizes, function (index, photo) {
        if (photo.media == "photo") {
            result = photo
        }
    });
    return result;
}

function generatePhotoLink(sizes) {
    var result = "";
    var photos = "";
    var videos = "";

    $.each(sizes, function (index, photo) {
        if (photo.media == "photo") {
            photos += "<a class='downloadlink' target='_blank' href='" + getPhotoURL(photo.source) + "'>" + photo.width + "x" + photo.height + "</a>";
        }
        else {
            videos += "<a class='downloadlink' target='_blank' href='" + photo.source + "'>" + photo.width + "x" + photo.height + "</a>";
        }
    });

    result += '<image class="thumbnail" src="' + sizes[0].source + '">';
    result += '<div class="links">';

    if (photos != '') {
        result += '<div class="photolink"><span class="linkname">Photo : </span><span>' + photos + '</span></div>';
    }
    if (videos != '') {
        result += '<div class="videolink"><span class="linkname">Video : </span><span>' + videos + '</span></div>';
    }
    result += "</div>";
    return result;
}

/**
 * Get the URL to open or download the big photo
 */
function getPhotoURL(url) {
    var urlArr = url.split(".");
    urlArr[urlArr.length - 2] += "_d";
    return urlArr.join(".");
}

function updateLast(id, content) {
    localStorage["lastID"] = id;
    localStorage["lastContent"] = content;
}

function restoreLast() {
    if (localStorage["lastContent"]) {
        $("#imgContainer").html(localStorage["lastContent"]);
    }
    else {

    }
}

function getPhotoset(option) {
    var query = 'flickr.photosets.getPhotos&per_page=500&page=' + option.page + '&photoset_id=' + option.id;
    sendRequest({
        query: query,
        global: false,
        onSuccess: function (response) {
            var html = "";
            if (response.stat == "ok") {
                if (response.photoset.photo) {
                    $.each(response.photoset.photo, function (index, photo) {
                        getPhoto({ id: photo.id });
                    });
                }
                if (option.page < response.photoset.pages) {
                    getPhotoset({ id: option.id, page: (option.page + 1) });
                }
            }
        }
    });
}

function getPhoto(option) {
    totalRequest++;
    var query = 'flickr.photos.getSizes&photo_id=' + option.id;
    sendRequest({
        query: query,
        global: true,
        onSuccess: function (response) {
            if (response.stat == "ok") {
                if (response.sizes) {
                    var photo = getLastPhoto(response.sizes.size);
                    var url = getPhotoURL(photo.source);
                    if (url != '' && url != null) {
                        clickDownloadUrl(url);
                    }
                }
            }
        }
    });
}



/**
 * Button handlers
 */
$(document).ready(function () {
    //chrome.tabs.query({
    //    active: true,
    //    windowId: chrome.windows.WINDOW_ID_CURRENT
    //},
    //function (tabs) {
    //    // and use that tab to fill in out title and url
    //    var tab = tabs[0];
    //    processImage(tab.url);
    //});
    $(document).ajaxComplete(function () {
        totalRequest--;
        if (totalRequest == 0) {
            localStorage["lastContent"] = $("#imgContainer").html();
        }
    });

});
function processImage(url) {
    console.log("processImage...")
    var parser = document.createElement('a');
    parser.href = url;
    var pathnames = parser.pathname.split('/');
    console.log("pathnames=", pathnames)
    // Set
    if (isElEqual(pathnames[3], "sets")) {
        if ((localStorage["lastID"] == pathnames[4]) && (localStorage["lastContent"])) {
            console.log("sets true...")
            restoreLast();
        }
        else {
            console.log("sets false...")
            localStorage["lastID"] = pathnames[4];
            getPhotoset({ id: pathnames[4], page: 1 });
        }
    }
    // Photo
    else if (isNumber(pathnames[3])) {
        if ((localStorage["lastID"] == pathnames[3]) && (localStorage["lastContent"])) {
            console.log("not sets true...");
            //restoreLast();
            localStorage["lastID"] = pathnames[3];
            getPhoto({ id: pathnames[3] });
        }
        else {
            console.log("not sets false...");
            localStorage["lastID"] = pathnames[3];
            getPhoto({ id: pathnames[3] });
        }
    }
}

function isElEqual(value1, value2) {
    if (typeof value1 != 'undefined') {
        if (value1 == value2) {
            return true;
        }
    }
    return false
}

function isNumber(value) {
    if (typeof value != 'undefined') {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    return false
}