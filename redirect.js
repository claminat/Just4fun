'use strict';
//https://www.phpflow.com/php/how-to-delete-multiple-selected-rows-using-ajax/


function hello(name) {
    console.log('Hello,', name);
};

jQuery('#master').on('click', function (e) {
    if ($(this).is(':checked', true)) {
        $(".sub_chk").prop('checked', true);
    }
    else {
        $(".sub_chk").prop('checked', false);
    }
});


jQuery('.post_all').on('click', function (e) {
    var allVals = [];
    var downloads = [];
   
    var captionType = $("#txtCaption").text();
    console.log('captionDefault', captionType);
    captionType = isEmpty(captionType) ? '...' : encodeURIComponent(captionType);
    var caption = captionType;
    if (debug) {
        console.log('caption', caption);
    }
    
    $(".sub_chk:checked").each(function () {
        allVals.push($(this).attr('data-id'));
        var srcUrl = $('img').filter("[data-id='" + $(this).attr('data-id') + "']").attr("src");

        var download = { srcUrl: srcUrl, caption: caption };
        if (debug) {
            console.log('download', download);
        }
        downloads.push(download);

    });
    if (allVals.length <= 0) {
        alert("Please select row.");
    }
    else {
        if (debug) {
            console.log('downloads', downloads);
        }
        callSocket(downloads);
    }
});

chrome.runtime.onMessage.addListener(function (request) {
    console.log('request', ' callRedirect', request);
    if (request.type === 'callRedirect') {
        console.log('redirect', 'onMessage', 'callRedirect');
        var data = request.data; console.log('data', data);
        $.each(data, function (index, download) {
            console.log(index , download);
            var src = download.url;
            var caption = download.caption; console.log('caption', caption);

            var row = "<tr data-row-id='" +index +"'>" +
                "<td><input type='checkbox' class='sub_chk' checked='checked' data-id='" +index +"'></td>" +
                "<td align='center'><img data-id='" +index +"' src='" +src +"' style='max-height: 50px; max-width:  50px;' /></td>" +
                "<td align='center'>" + caption+"</td>" +

                "</tr>";

            $("tbody").append(row);
            
            $("#txtCaption").text(caption);
        });
        

    }
});


function callSocket(downloads) {

    socketPromise.then(function (socket) {
        if (debug) {
            console.log('downloads', downloads);
        }
        //socket.emit('facebook', downloads);
        chrome.runtime.getBackgroundPage(function (bgWindow) {
            //window.close();
        });
    });
}