function browserActionInstagram(tab) {
    console.log('------------------------------------------------');
    console.log(arguments.callee.name);
    //chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, callbackBrowserAction);
    chrome.tabs.sendMessage(tab.id, { text: 'browserAction' });
}
