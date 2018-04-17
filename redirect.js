'use strict';
//https://www.phpflow.com/php/how-to-delete-multiple-selected-rows-using-ajax/


var tab;

$(function () {
    var data = [
        {
            "created_time": "2018-04-17T02:05:09+0000",
            "name": "🌴 🌴 🌴 Bikini 🌴 🌴🌴",
            "id": "1681833578574485"
        },
        {
            "created_time": "2018-04-11T01:58:09+0000",
            "name": "❤️So cute ❤️",
            "id": "1675564655868044"
        },
        {
            "created_time": "2018-04-11T02:01:30+0000",
            "name": "⚔⚔⚔ (.)(.) ⚔⚔⚔",
            "id": "1675568209201022"
        },
        {
            "created_time": "2018-04-13T08:02:48+0000",
            "name": "emmyozawa",
            "id": "1677907068967136"
        },
        {
            "created_time": "2018-04-11T01:54:24+0000",
            "name": "☘☘☘ (y) ☘☘☘",
            "id": "1675561319201711"
        },
        {
            "created_time": "2018-04-17T01:34:04+0000",
            "name": "📷📷📷 Selfie 📷📷📷",
            "id": "1681809625243547"
        },
        {
            "created_time": "2018-04-11T09:33:18+0000",
            "name": "🐰🐰🐰 Behind a girl 🐰🐰🐰",
            "id": "1675840545840455"
        },
        {
            "created_time": "2018-04-17T01:26:09+0000",
            "name": "💣 💣 💣  Sleepwear  💣 💣 💣",
            "id": "1681803885244121"
        },
        {
            "created_time": "2017-07-03T07:48:29+0000",
            "name": "Timeline Photos",
            "id": "1403878896369956"
        },
        {
            "created_time": "2018-04-16T02:11:42+0000",
            "name": "Yumi Sugimoto  🔫",
            "id": "1680847098673133"
        },
        {
            "created_time": "2018-04-13T07:48:41+0000",
            "name": "fromise_",
            "id": "1677893795635130"
        },
        {
            "created_time": "2018-04-09T01:55:43+0000",
            "name": "fluffylady_",
            "id": "1673416516082858"
        },
        {
            "created_time": "2018-03-22T02:51:55+0000",
            "name": "vivamai",
            "id": "1654459614645215"
        },
        {
            "created_time": "2018-03-22T02:34:02+0000",
            "name": "mieryap",
            "id": "1654448994646277"
        },
        {
            "created_time": "2018-03-22T02:19:19+0000",
            "name": "cooicu",
            "id": "1654433207981189"
        },
        {
            "created_time": "2018-03-22T02:08:05+0000",
            "name": "meo5169",
            "id": "1654426384648538"
        },
        {
            "created_time": "2018-03-22T02:05:11+0000",
            "name": "poi850911",
            "id": "1654424677982042"
        },
        {
            "created_time": "2018-03-22T01:57:45+0000",
            "name": "aytxmg",
            "id": "1654418814649295"
        },
        {
            "created_time": "2018-03-22T01:52:59+0000",
            "name": "inkyung97",
            "id": "1654414214649755"
        },
        {
            "created_time": "2018-03-08T02:05:51+0000",
            "name": "[IMISS] VOL.003 ALICE梁紫轩",
            "id": "1638949882862855"
        },
        {
            "created_time": "2017-11-11T06:09:02+0000",
            "name": "taeyeon",
            "id": "1522472797843898"
        },
        {
            "created_time": "2017-07-03T03:35:22+0000",
            "name": "Cover Photos",
            "id": "1403737263050786"
        },
        {
            "created_time": "2017-07-03T03:33:12+0000",
            "name": "Profile Pictures",
            "id": "1403736449717534"
        }
    ];
    var dropdown = $('.selectpicker');
    dropdown.empty();
    dropdown.append('<option selected="true"></option>');
    dropdown.prop('selectedIndex', 0);

    $.each(data, function (key, option) {
        dropdown.append($('<option></option>').attr('value', option.id).text(option.name));
    });


    //$('.selectpicker').change(function() {
    //    var slecteditem = $(this).find("option:selected").val();
    //    alert(slecteditem);
    //});
});

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


    var albumId = $('.selectpicker').find("option:selected").val();

    $(".sub_chk:checked").each(function () {
        allVals.push($(this).attr('data-id'));
        var srcUrl = $('img').filter("[data-id='" + $(this).attr('data-id') + "']").attr("src");
        var captionDefault = $('img').filter("[data-id='" + $(this).attr('data-id') + "']").attr("caption"); if (debug) { console.log('captionDefault', captionDefault); }
        var folder = $('img').filter("[data-id='" + $(this).attr('data-id') + "']").attr("folder"); if (debug) { console.log('folder', folder); }

        var caption = isEmpty(captionType) ? captionDefault : captionType; if (debug) { console.log('caption', caption); }
        var download = { srcUrl, caption, albumId, folder };
        if (debug) {
            console.log('download', download);
        }
        downloads.push(download);

    });
    if (allVals.length <= 0) {
        alert("Please select row.");
    }
    else {
       
        //socket post to facebook
        callSocket(downloads);

        //download to local
        var isDownload = $('#downloadCheckbox').is(":checked");
        console.log(isDownload);
        if (debug) {
            console.log('downloads', downloads);
            console.log('isDownload', isDownload);
        }
        if (isDownload) {
            if (debug) {
                console.log('isDownload', isDownload);
            }
            chrome.runtime.sendMessage({ data: downloads, type: 'downloads' }, function (response) { });
            chrome.tabs.remove(tab.id, function () { });
        }

    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {


    if (request.type === 'callRedirect') {

        var data = request.data;
        tab = request.tab;
        if (debug) {
            console.log('redirect', 'onMessage', 'callRedirect', 'request', request);
            console.log('redirect', 'onMessage', 'callRedirect', 'request.tab', request.tab);
            console.log('redirect', 'onMessage', 'callRedirect', 'request.data', request.data);
            console.log('redirect', 'onMessage', 'callRedirect', 'request.data.length', request.data.length);
        }
        $('span.badge').text(data.length);

        $.each(data, function (index, download) {

            if (debug) { console.log(index, download); }
            var srcUrl = download.srcUrl;
            var caption = download.caption; console.log('caption', caption);
            var folder = download.folder; console.log('folder', folder);

            var row = "<tr data-row-id='" + index + "'>" +
                "<td><input type='checkbox' class='sub_chk' checked='checked' data-id='" + index + "'></td>" +
                "<td align='center'><img data-id='" + index + "' caption='" + caption + "' folder='" + folder + "' src='" + srcUrl + "' style='max-height: 50px; max-width:  50px;' /></td>" +
                "<td align='center'>" + caption + "</td>" +

                "</tr>";

            $("tbody").append(row);

            $("#txtCaption").val(caption);
            $("#downloadLabel").text(folder);
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