'use strict';

var captionType = $('#caption').val(); console.log('captionType', encodeURIComponent(captionType));







function hello(name) {
    console.log('Hello,', name);
};
$(function () {
    $('form').ajaxForm(function () {
        console.log('ajaxForm');
        var captionType = $('#caption').val(); console.log('captionType', encodeURIComponent(captionType));
        var captionDefault = $("div").text(); console.log('captionDefault', captionDefault);
        var srcUrl = $('img').attr("src"); console.log('srcUrl', srcUrl);

        socketPromise.then(function (socket) {
            var caption = isEmpty(captionType) ? captionDefault : captionType; console.log('caption', caption);
            var result = { srcUrl: srcUrl, caption: caption };
            socket.emit('facebook', result);
            chrome.runtime.getBackgroundPage(function (bgWindow) {
                window.close();
            });
        });
        console.log('ajaxForm', '------------------------------------------------');
    });
});

chrome.runtime.onMessage.addListener(function (request) {
    console.log('request', ' callRedirect', request);
    if (request.type === 'callRedirect') {
        console.log('redirect', 'onMessage', 'callRedirect');
        var data = request.data; console.log('data', data);
        $("img").attr("src", data.srcUrl);
        $("div").text(data.caption);
    }
});