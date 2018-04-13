//https://www.w3schools.com/howto/howto_css_image_text.asp
//http://voidcanvas.com/how-to-check-if-all-the-images-of-a-page-are-loaded-using-simple-jquery/
//https://stackoverflow.com/questions/11553600/how-to-inject-css-using-content-script-file-in-chrome-extension/11554116
//https://www.kirupa.com/html5/get_element_position_using_javascript.htm
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//var debug = true;
var downloads = [];

if (debug) {
    console.log("(debug)Cái lồn con đĩ.");
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var pageUrl = window.location.href;
    if (debug) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        console.log('onMessage', 'request', request);
    }
    if (request.type === 'browserAction') {
        if (debug) {
            console.log('browserAction', '------------------------------------------------');
        }
        //sendResponse(document.all[0].outerHTML);
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        if (debug) {
            console.log('downloads', downloads);
        }

        chrome.runtime.sendMessage({ data: downloads, type: 'downloads' }, function (response) { });
    }
    if (request.type === 'callContentScripts') {
        if (debug) {
            console.log('callContentScripts', '------------------------------------------------');
        }
        var caption = getCaption(pageUrl);
        $.map(downloads, function (download, i) {
            download.caption = caption;
        });
        if (debug) {
            console.log('downloads', downloads);
        }
        chrome.runtime.sendMessage({ data: downloads, type: 'openRedirect' });
    }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
preLoad();

//#region preLoad
function preLoad() {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }
    var pageUrl = window.location.href;
    //instagram
    $("div").removeClass("_si7dy");
    prepareDownload();
}

function prepareDownload() {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }
    var pageUrl = window.location.href;
    var rootDomain = extractRootDomain(pageUrl);
    if (rootDomain) {
        if (isDomain(pageUrl, "instagram")) {
            prepareDownloadInstagram(pageUrl);
        } else if (isDomain(pageUrl, "flickr")) {

        } else if (isDomain(pageUrl, "tumblr")) {
            prepareDownloadTumblr(pageUrl);
        }
    }
}

function prepareDownloadInstagram() {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');

    }
    var pageUrl = window.location.href;
    var folder = getFolder(pageUrl);
    var caption = getCaption(pageUrl);
    //url
    $("meta[name='medium']").map(function (index) {
        //console.log('meta[name=\'medium\']', index, this.content);
        var content = this.content; //console.log('content', content);
        var metaTags;
        if (content === 'image') {
            ////download single
            //metaTags = $("meta[property='og:image']");

            //download all
            $("script").map(function (index) {
                //console.log('script', index, this);
                var html = $(this).html();
                if (has(html, 'window._sharedData =')) {
                    if (debug) {
                        console.log('script[', index, ']', this);

                    }

                    var script = html.slice(0, -1).replace('window._sharedData =', ''); //console.log('script', index, script);
                    var json = jQuery.parseJSON(script); //console.log('json', json);
                    //var postPages = json.entry_data.PostPage[0];//console.log('postPage', postPages);
                    if (json) {
                        json.entry_data.PostPage.map(function (postPage) {
                            if (debug) {
                                console.log('postPage', postPage);
                            }
                            if (postPage.graphql.shortcode_media.edge_sidecar_to_children) {
                                var edges = postPage.graphql.shortcode_media.edge_sidecar_to_children.edges;
                                edges.map(function (edge) {
                                    var display_url = edge.node.display_url;
                                    if (debug) {
                                        console.log('display_url', display_url);
                                    }

                                    var src = display_url;
                                    var download = {
                                        url: src,
                                        folder: folder,
                                        caption: caption
                                    };
                                    downloads.push(download);
                                    if (debug) {
                                        console.log('download', download);
                                    }
                                });
                            } else {
                                var display_url = postPage.graphql.shortcode_media.display_url;

                                if (debug) {
                                    console.log('display_url', display_url);

                                }
                                var src = display_url;
                                var download = {
                                    url: src,
                                    folder: folder,
                                    caption: caption
                                };
                                downloads.push(download);
                                if (debug) {
                                    console.log('download', download);

                                }
                            }
                        });
                    }
                }
            });
        }
        if (content === 'video') {
            metaTags = $("meta[property='og:video']");

        }
        if (metaTags) {
            metaTags.map(function (index) {
                console.log('meta.content', index, this.content);
                var src = this.content; console.log('src', src);
                var download = {
                    url: src,
                    folder: folder,
                    caption: caption
                };
                downloads.push(download);
                if (debug) {
                    console.log('download', download);
                }
            });
        }
    });
    if (debug) {
        console.log('downloads', downloads);

    }


}

function prepareDownloadTumblr() {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }
    var pageUrl = window.location.href;
    var folder = getFolder(pageUrl);

    var postId = pageUrl.split('/')[4]; console.log(postId);
    console.log('------------------------------------------------');
    $("meta[property='og:image']").map(function (index) {
        console.log('og:image', index, this.content);
        var src = this.content;
        var download = { url: src, folder: folder };
        downloads.push(download);
        console.log('download', download);
    });
    console.log('------------------------------------------------');
    $("img[class='small']").map(function (index) {
        console.log('img', index, this);
        var src = this.src;
        var download = { url: src, folder: folder };
        downloads.push(download);
        console.log('download', download);
    });
    console.log('downloads', downloads);



    //var arrayUrl = url.split('/'); //console.log(arrayUrl);
    //var postId = arrayUrl[4]; //console.log(postId);
    //return postId;
    //$("iframe[id*='photoset_iframe_" + postId + "']").map(function (index) {
    //    console.log('iframe', index, this);
    //    $(this).contents().find("a").map(function (index) {
    //        var src = this.href;
    //        console.log(index, 'iframe->a.href', this.href);
    //        var download = {
    //            url: src,
    //            folder: folder
    //        };
    //        chrome.runtime.sendMessage({ data: download, text: 'download' }, function (response) {});
    //    });
    //});

}

//#endregion


//#region action

if (debug) {
    var pageUrl = window.location.href;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var barImg = document.createElement('img');
barImg.id = "barImgId";
barImg.style.display = 'none';
barImg.style.opacity = 0;
barImg.style.position = 'absolute';
barImg.style.zIndex = 99999999999;
barImg.src = "https://cdn4.iconfinder.com/data/icons/nature-life-in-color/128/snowflake-20.png";
document.body.appendChild(barImg);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("mousemove", 'img', imgMouseOvered);
$(document).on("mouseout", 'img', imgMouseOuted);


$('#barImgId').click(function () {
    if (debug) {
        console.log("'#barImgId').click", '------------------------------------------------');
    }
    chrome.storage.local.get(["downloadItem"], function (downloadItem) {
        if (downloadItem) {
            console.log('downloadItem', downloadItem);
            var data = { type: 'openRedirect', data: downloadItem };
            chrome.runtime.sendMessage(data, function (response) { });
        }
    });
});

function imgMouseOvered(evt) {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }

    var width = $(this).width(); //console.log('width', width);
    var height = $(this).height(); //console.log('height', height);

    var src = this.src;
    if (debug) { console.log('src', src); }

    if (evt.target.id === 'barImgId') {
        if (debug) {
            console.log('barImgId');
        }
        $('#barImgId').css('opacity', 1);
        $('#barImgId').css('display', 'inline-block');
    } else {
        var targetOffset = $(evt.target).offset();
        $('#barImgId').css('left', targetOffset.left + width - $('#barImgId').width() + 'px');
        $('#barImgId').css('top', targetOffset.top + 'px');
        $('#barImgId').css('opacity', 1);
        $('#barImgId').css('display', 'inline-block');

        var pageUrl = window.location.href;
        var rootDomain = extractRootDomain(pageUrl);
        var caption = getCaption(pageUrl);
        var data;
        if (rootDomain) {
            if (isDomain(pageUrl, "instagram")) {
                data = { url: src, caption: caption, folder: getFolder(pageUrl) };
            } else if (isDomain(pageUrl, "flickr")) {
                //
            } else if (isDomain(pageUrl, "tumblr")) {
                data = { url: src, caption: caption, folder: getFolder(pageUrl) };
            } else {
                var infoUrl = deconstructURL(pageUrl);
                console.log('cUrlcUrl', infoUrl);
                data = { url: src, caption: caption, folder: infoUrl.hostname + '/' };
            }
            if (data) {
                console.log('data', data);
                chrome.storage.local.set({ "downloadItem": data }, function () { });
            }
        }



    }
    if (debug) {
        var msg = "Handler for .mousemove() called at ";
        msg += event.pageX + ", " + event.pageY;
        $("#log").append("<div>" + msg + "</div>");
        console.log(msg);
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //$('#barImgId').removeAttr('click');
    //$('#barImgId').on("click", function (event) {
    //    console.log(src + ", hi there!");
    //});

    //$('#barImgId').wrap('<a href="' + src + '" download="myImage" />');
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

}//imgMouseOvered

//$("img").mousemove(function (event) {

//    var msg = "Handler for .mousemove() called at ";
//    msg += event.pageX + ", " + event.pageY;
//    $("#log").append("<div>" + msg + "</div>");
//    console.log(msg);

//});

function imgMouseOuted(evt) {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }
    if (evt.target.id === 'barImgId') {
        return;
    }
    //hide floatBarImg
    $('#barImgId').css('display', 'none');
    //floatBarImg.style.opacity = 0
    $('#barImgId').css('opacity', 0);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//$("img").map(function (index) {
//    //console.log('index', index);
//    //console.log('this', this);console.log('$(this)', $(this));
//    var src = this.src; //console.log('src', src);
//    $(this).hover(function (evt) {//mouseover
//            console.log('src', src);
//        }, function () {//mouseout
//            $('#barImgId').css('opacity', 0);
//            $('#barImgId').css('display', 'none ');
//        }
//    );
//    return this.src;
//});

//#endregion


function getFolder(pageUrl) {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }
    var rootDomain = extractRootDomain(pageUrl);
    if (rootDomain) {
        var rootFolder;
        var arrayUrl;
        var subFolder;
        var folder;
        if (isDomain(pageUrl, "instagram")) {
            rootFolder = "instagram/";
            arrayUrl = pageUrl.split('/');
            subFolder = arrayUrl[5].split('=')[1] + '/';
            folder = rootFolder + subFolder;
            if (debug) {
                console.log('arrayUrl', arrayUrl);
                console.log('subFolder', subFolder);
                console.log('folder', folder);
            }
            return folder;
        } else if (isDomain(pageUrl, "flickr")) {
            //
        } else if (isDomain(pageUrl, "tumblr")) {
            rootFolder = "tumblr/";
            arrayUrl = pageUrl.split('/');
            subFolder = arrayUrl[2].split('.')[0] + '/'; console.log('subFolder', subFolder);

            var title = arrayUrl[5]; //console.log('title', title);
            if (title) {
                title = decodeURI(title.split('?')[0]);
                console.log('title', title);
                folder = rootFolder + subFolder + decodeURI(title) + '/';
            } else {
                folder = rootFolder + subFolder;
            }
            if (debug) {
                console.log('arrayUrl', arrayUrl);
                console.log('subFolder', subFolder);
                console.log('folder', folder);
            }


            return folder;
        } else {
            var infoUrl = deconstructURL(pageUrl);

            folder = infoUrl.hostname;
            if (debug) {
                console.log('cUrlcUrl', infoUrl);
            }
            return folder;
        }
        return '';
    }
    return '';
}

function getCaption(pageUrl) {
    if (debug) {
        console.log(arguments.callee.name, '------------------------------------------------');
    }
    var rootDomain = extractRootDomain(pageUrl);
    if (rootDomain) {
        var caption = '...';
        if (isDomain(pageUrl, "instagram")) {
            caption = $("title").text();
            if (debug) {
                console.log('caption', caption);
            }
            caption = caption.substring(caption.lastIndexOf('“') + 1, caption.lastIndexOf('”'));
            if (debug) {
                console.log('caption', caption);
            }
        } else if (isDomain(pageUrl, "flickr")) {
        } else if (isDomain(pageUrl, "tumblr")) {
            caption = $("title").text();

        }
        return caption;
    }
    return '...';
}