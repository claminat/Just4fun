+console.log('backgroundScripts...');
var icon32 = 'icons/favorites512.png';
// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

chrome.alarms.onAlarm.addListener(function() {
  chrome.browserAction.setBadgeText({text: ''});
  chrome.notifications.create({
      type:     'basic',
      iconUrl:  'stay_hydrated.png',
      title:    'Time to Hydrate',
      message:  'Everyday I\'m Guzzlin\'!',
      buttons: [
        {title: 'Keep it Flowing.'}
      ],
      priority: 0});
});

chrome.notifications.onButtonClicked.addListener(function() {
  chrome.storage.sync.get(['minutes'], function(item) {
    chrome.browserAction.setBadgeText({text: 'ON'});
    chrome.alarms.create({delayInMinutes: item.minutes});
  });
});

var socket = io.connect('http://localhost:3002');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello from Google extension');
});

chrome.contextMenus.create({
    id: 'open',
    title: chrome.i18n.getMessage('openContextMenuTitle'),
    contexts: ["all","image", "video"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    var pageUrl = info.pageUrl;
    var srcUrl = info.srcUrl;
    console.log(pageUrl,pageUrl);
});
