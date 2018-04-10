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
    var captionType = $("#txtCaption").val(); if (debug) { console.log('captionType', captionType); }



    $(".sub_chk:checked").each(function () {
        allVals.push($(this).attr('data-id'));
        var srcUrl = $('img').filter("[data-id='" + $(this).attr('data-id') + "']").attr("src");
        var captionDefault = $('img').filter("[data-id='" + $(this).attr('data-id') + "']").attr("caption"); if (debug) { console.log('captionDefault', captionDefault); }

        var caption = isEmpty(captionType) ? captionDefault : captionType; if (debug) { console.log('caption', caption); }
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
    if (request.type === 'callRedirect') {
        if (debug) {
            console.log('redirect', 'onMessage', 'callRedirect', 'request', request);
        }
        var data = request.data; console.log('data', data);
        $.each(data, function (index, download) {
            console.log(index, download);
            var src = download.url;
            var caption = download.caption; console.log('caption', caption);

            var row = "<tr data-row-id='" + index + "'>" +
                "<td><input type='checkbox' class='sub_chk' checked='checked' data-id='" + index + "'></td>" +
                "<td align='center'><img data-id='" + index + "' caption='" + caption + "' src='" + src + "' style='max-height: 50px; max-width:  50px;' /></td>" +
                "<td align='center'>" + caption + "</td>" +

                "</tr>";

            $("tbody").append(row);

            $("#txtCaption").val(caption);
        });


    }
});


function callSocket(downloads) {
    if (debug) { console.log('redirect', 'callSocket', downloads) }
    socketPromise.then(function (socket) {
        socket.emit('facebook', downloads);
        chrome.runtime.getBackgroundPage(function (bgWindow) {
            window.close();
        });
    });
}