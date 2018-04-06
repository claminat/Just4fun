//test();

function test() {
    var url = 'https://www.instagram.com/p/BeDvT1SHv32/?taken-by=cooicu';
    var xpath = "/html/head/meta[contains(@property,'og:image')]";
    $.ajax({
            url: url, data: 'json', type: "get", success: function (data) {
                let doc = new DOMParser().parseFromString(data, 'text/html');
                var imageSrcs = $("meta", doc).map(function (index) {

                    var src = this.src;
                    if (index === 0) {
                        console.log(index, 'src', src);
                        var download = { url: src, folder: 'folderTumblr' };
                        
                    }
                    return this.src;
                });
                console.log('imageSrcs', imageSrcs);

                //let items = getElementsByXPath(xpath, doc);
                //items.forEach(function (element) {
                //        var src = element.getAttribute('content');
                //        //
                //        downloadUrl(src);
                //    }
                //);//console.log('items ' + items);
            }, error: function (e, xhr) {
                console.log(e);
            }
        }
    );


}




//function test() {
//    var url = 'https://78.media.tumblr.com/019082d572a081e5951577f925979b64/tumblr_p4uia71XET1wlu2abo1_1280.jpg';
//    url = 'https://c1.staticflickr.com/5/4789/40000627884_5e82b7a476_k.jpg';
//    var path = 'tumblr/cuterias/tumblr_p4uia71XET1wlu2abo1_1280.jpg';
//    //chrome.downloads.download({ url: url, filename: path, conflictAction: 'overwrite' });
//    //chrome.downloads.download({
//    //    url: url,
//    //    //filename: "suggested/filename/with/relative.jpg"
//    //    filename: "relative.jpg" 
//    //});
//    chrome.downloads.download({
//        url: url,
//        filename: 'my-image-again.png',
//        conflictAction: 'uniquify'
//    });
//}

//function test() {
//    var pageUrl = 'https://www.flickr.com/photos/neildchenyi/26756476348/in/dateposted/';
//    var arrayUrl = pageUrl.split('/'); console.log(arrayUrl);
//    var folderFlickr = arrayUrl[4]; console.log('folderFlickr', folderFlickr);
//    var photoId = arrayUrl[5]; console.log('photoId', photoId);
//    var urlGetSizes = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + photoId + "&format=json&nojsoncallback=1";
//    $.getJSON(urlGetSizes, function (items) {
//        console.log('------------------------------------------------');
//        console.log('items'); console.log(items);
//        //var highest = items.sizes.size[Object.keys(items.sizes.size).pop()];

//        var src = items.sizes.size[Object.keys(items.sizes.size).pop()].source;
//        console.log('src'); console.log(src);
//        var folder = 'flickr/'+folderFlickr +'/';
//        console.log('folder'); console.log(folder);
//        downloadUrl(src, folder);

//    });

//}


