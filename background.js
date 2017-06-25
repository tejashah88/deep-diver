const db = chrome.storage.sync;
var isRecording = false;
var startTime, endTime;

function getCurrTabUrl(callback) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    callback(tabs[0].url);
  });
}

function getAllLinksInPage() {
  var urls = [];
  for (var i = document.links.length; i-- > 0;)
    urls.push(document.links[i].href);

  return urls;
}

function tabLinkListener(tabId, changeInfo, tab) {
  var data = {
  };

  if (undefined !== changeInfo.url) {
    var new_curr_url = changeInfo.url;
  }
}

/*
Pages:
[
  {
    url: “linkedin.com/marc-andreesen”,
    ParentPageID: null,
    Notes: [0, 1]
  },
  {
    url: “https://en.wikipedia.org/wiki/Marc_Andreessen”,
    ParentPageID: 0,
    Notes: [2]
  } 
]
*/

function startRecording() {
  /*
   Steps (starting with google search site)
   1. start tab link listener
   2. get current tab url
   3. get all possible urls to click
   */
  
  chrome.tabs.onUpdated.addListener(tabLinkListener);

  getCurrTabUrl((curr_url) => {
    ;
  })
}

function stopRecording() {
  chrome.tabs.onUpdated.removeListener(tabLinkListener);
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === "sync") {
    isRecording = changes['active_dive'].newValue !== null;
  }
});

function messageListener(request, sender, sendResponse) {
  if (request.type === "note") {
    const content = request.content;
    const tag = request.tag;
    const pageUrl = request.pageUrl;

    const requesterTab = sender.tab;
    return true;
  }

  return true;
}

chrome.runtime.onMessage.addListener(messageListener);

/*document.addEventListener('DOMContentLoaded', function() {
  chrome.windows.create({
    url: "http://www.google.com",
    type: "normal"
  });
});*/