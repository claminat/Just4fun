'use strict';

$(function () {
    $('form').ajaxForm(function () {
        console.log('ajaxForm');
        var caption = $('#caption').val();
        var srcUrl = $('img').attr("src");
        socketPromise.then(function (socket) {
            var result = { srcUrl: srcUrl, caption: caption };
            socket.emit('messages', result);
            window.close();
        });
    });

});

//document.forms[0].onsubmit = function (e) {
//    e.preventDefault(); // Prevent submission
//    //var password = document.getElementById('pass').value;
//    //chrome.runtime.getBackgroundPage(function (bgWindow) {
//    //    bgWindow.setPassword(password);
//    //    window.close();     // Close dialog
//    //});

//    //var caption = $('#caption').val();
//    //var srcUrl = $('img').attr("src");
//    //socketPromise.then(function (socket) {
//    //    var result = { srcUrl: srcUrl, caption: caption };
//    //    socket.emit('messages', result);


//    //});

//    console.log('chrome.storage.local.get(["data"], function (data)');
//    chrome.storage.local.get(["data"], function (item) {
//        if (item) {
//            console.log('item', item);
//            //chrome.runtime.sendMessage({ data: item.data, text: "download" }, function (response) { });
//            socketPromise.then(function (socket) {
//                socket.emit('messages', item);
//            });
//        }
//    });

//};


chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'request_redirect') {
        console.log('redirect', 'onMessage', 'request_redirect');
        console.log('request', request);

        var data = request.data;
        console.log('data', data);
        $("img").attr("src", data);
    }
});