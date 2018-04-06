//https://www.w3schools.com/howto/howto_css_image_text.asp
//http://voidcanvas.com/how-to-check-if-all-the-images-of-a-page-are-loaded-using-simple-jquery/
//https://stackoverflow.com/questions/11553600/how-to-inject-css-using-content-script-file-in-chrome-extension/11554116
//https://www.kirupa.com/html5/get_element_position_using_javascript.htm
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var debug = false;
//if (debug === true) {
//    console.logg = console.log;
//} else {
//    console.logg = function donothing() {
//    }
//}

if (debug) {
    console.log("(debug)Cái lồn con đĩ.");
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    console.log('chrome.runtime.onMessage.addListener');
    // If the received message has the expected format...
    if (msg.text === 'browserAction') {
        console.log('browserAction');
        // Call the specified callback, passing// the web-page's DOM content as argument
        //sendResponse(document.all[0].outerHTML);
        ////+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var pageUrl = window.location.href;
        ////+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //download from 'downloads=[] variable'
        chrome.runtime.sendMessage({ data: downloads, text: 'downloads' }, function (response) { });
    }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var downloads = [];
preLoad();

function preLoad() {
    console.log('----------start-', arguments.callee.name,'----------');
    var pageUrl = window.location.href;
    //instagram
    $("div").removeClass("_si7dy");
    //$("div[class='_4rbun']").map(function (index) {
    //    console.log('_4rbun', index, this);
    //});
    //

    //getFolder(pageUrl);


    prepareDownload();
    console.log('----------end-', arguments.callee.name, '----------');

}

function prepareDownload() {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
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
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
    console.log('------------------------------------------------');
    var pageUrl = window.location.href;
    var folder = getFolder(pageUrl);
    console.log('------------------------------------------------');
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
                    console.log('script[', index,']', this);
                    var script = html.slice(0, -1).replace('window._sharedData =', ''); //console.log('script', index, script);
                    var json = jQuery.parseJSON(script); //console.log('json', json);
                    //var postPages = json.entry_data.PostPage[0];//console.log('postPage', postPages);
                    if (json) {
                        json.entry_data.PostPage.map(function (postPage) {
                            console.log('postPage', postPage);
                            if (postPage.graphql.shortcode_media.edge_sidecar_to_children) {
                                var edges = postPage.graphql.shortcode_media.edge_sidecar_to_children.edges;
                                edges.map(function (edge) {
                                    var display_url = edge.node.display_url;
                                    console.log('display_url', display_url);
                                    var src = display_url;
                                    var download = {
                                        url: src,
                                        folder: folder
                                    };
                                    downloads.push(download);
                                    console.log('download', download);

                                });
                            } else {
                                var display_url = postPage.graphql.shortcode_media.display_url;
                                console.log('display_url', display_url);
                                var src = display_url;
                                var download = {
                                    url: src,
                                    folder: folder
                                };
                                downloads.push(download);
                                console.log('download', download);
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
                    folder: folder
                };
                downloads.push(download);
                console.log('download', download);
            });
        }
    });
}

function prepareDownloadTumblr() {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
    //folder
    var pageUrl = window.location.href;
    var folder = getFolder(pageUrl);
  
    var postId = pageUrl.split('/')[4]; console.log(postId);
    console.log('------------------------------------------------');
    $("meta[property='og:image']").map(function (index) {
        console.log('og:image', index, this.content);
        var src = this.content;
        var download = {
            url: src,
            folder: folder
        };
        downloads.push(download);
        console.log('download', download);
    });
    console.log('------------------------------------------------');
    $("img[class='small']").map(function (index) {
        console.log('img', index, this);
        var src = this.src;
        var download = {
            url: src,
            folder: folder
        };
        
        downloads.push(download);
        console.log('download', download);
    });


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

//#region action

if (debug) {
    var pageUrl = window.location.href;
    
    //$("img").map(function (index) {
    //    console.log('img', index, this);
    //    var attr = $(this).attr('srcset');
    //    if (typeof attr !== typeof undefined && attr !== false) {
    //        console.log('img', index, this);
    //    }
    //    return this.src;
    //});
    //var url = "https://www.instagram.com/p/BgW8pj5Bx0R/?taken-by=portraits_vision";
    //$.post("https://igeturl.com/get.php", { url: url })
    //    .done(function (data) {
    //        console.log("Data Loaded: " + data);
    //    });
    //$.ajax({
    //    url: 'https://www.google.com.vn/',
    //    success: function (data) {
    //        console.log('data', data);
    //    }
    //});
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //var url = "https://www.instagram.com/p/BgW8pj5Bx0R/?taken-by=portraits_vision";
    //var arrayUrl = url.split('/'); console.log(arrayUrl);
    //var key = arrayUrl[4];
    //console.log('key', key);

    //var src = 'https://instagr.am/p/' + key + '/media/?size=l'; console.log('src', src);
    ////var src = 'https://api.instagram.com/oembed?url=https://www.instagram.com/p/BgW8pj5Bx0R';
    //$.ajax({
    //    type: 'GET',
    //    crossDomain: true,
    //    url: src,
    //    cache: false,
    //    dataType: 'jsonp',
    //    success: function (data) {
    //        console.log("Success");
    //        try {
    //            console.log(data);
    //        } catch (err) {
    //            console.log('catch->err', err);
    //        }
    //    },
    //    error: function (err) {
    //        console.log('error->err', err);
    //    }
    //});
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
    console.log('chrome.storage.local.get(["data"], function (data)');
    chrome.storage.local.get(["data"], function (item) {
        if (item) {
            console.log('item', item);
            chrome.runtime.sendMessage({ data: item.data, text: "download" }, function (response) { });
        }
    });
});



//Instagram
function imgMouseOveredInstagram(url) {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
    var pageUrl = window.location.href;
    var folder = getFolder(pageUrl);
    url = "https://www.instagram.com/p/BgW8pj5Bx0R/?taken-by=portraits_vision";

    console.log('------------------------------------------------');

    //$.post("https://igeturl.com/get.php", { url: url })
    //    .done(function (data) {
    //        console.log("Data Loaded: " + data);
    //    });

    //$.ajax({
    //    type: 'POST',
    //    // make sure you respect the same origin policy with this url:
    //    // http://en.wikipedia.org/wiki/Same_origin_policy
    //    url: 'https://igeturl.com/get.php',
    //    data: {
    //        url: "https://www.instagram.com/p/BgW8pj5Bx0R/"
    //    },
    //    success: function (msg) {
    //        console.log('wow' + msg);
    //    }
    //});
    console.log('------------------------------------------------');
}

function imgMouseOvered(evt) {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);

    //console.log('posititon', getPosition(this));
    //console.log('event', event);

    var width = $(this).width(); //console.log('width', width);
    var height = $(this).height(); //console.log('height', height);

    var src = this.src; console.log('src', src);
    if (evt.target.id == 'barImgId') {
        if (debug) {
            console.logg('barImgId');
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
        var data;
        if (rootDomain) {
            if (isDomain(pageUrl, "instagram")) {
                //data = { url: src, folder: getFolder(pageUrl) };
                imgMouseOveredInstagram(src);
            } else if (isDomain(pageUrl, "flickr")) {

            } else if (isDomain(pageUrl, "tumblr")) {
                data = { url: src, folder: getFolder(pageUrl) };
            } else {
                var infoUrl = deconstructURL(pageUrl);
                console.log('cUrlcUrl', infoUrl);
                data = { url: src, folder: infoUrl.hostname + '/' };
            }
            if (data) {
                console.log('data', data);
                chrome.storage.local.set({ "data": data }, function () { });
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
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
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
            arrayUrl = pageUrl.split('/'); console.log('arrayUrl',arrayUrl);
            subFolder = arrayUrl[2].split('.')[0] + '/'; console.log('subFolder', subFolder);

            var title = arrayUrl[5]; //console.log('title', title);
            if (title) {
                title = decodeURI(title.split('?')[0]);
                console.log('title', title );
                folder = rootFolder + subFolder + decodeURI(title)+'/'; 
            } else {
                folder = rootFolder + subFolder; 
            }
            console.log('folder', folder); console.log('folder', folder);
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