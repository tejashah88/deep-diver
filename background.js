const db = chrome.storage.sync;
var isRecording = false;
var startTime, endTime;

function getLastFocusTabUrl(callback) {
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

function startRecording() {
  chrome.tabs.onUpdated.addListener(tabLinkListener);
}

function stopRecording() {
  chrome.tabs.onUpdated.removeListener(tabLinkListener);
}

function recordingStateListener(changes, areaName) {
  if (areaName === "sync") {
    isRecording = changes['active_dive'] !== null;
  }
}

function tabLinkListener(tabId, changeInfo, tab) {
  var data = {
  };

  if (changeInfo.url)
    console.log(changeInfo.url);
}

function messageListener(request, sender, sendResponse) {
  /*if (request.request == 'get-active-dive') {
    chrome.storage.sync.get('active_dive', (result) => {
      const active_dive = result.active_dive;
      sendResponse({active_dive: active_dive});
      return true;
    });
  }*/
  if (request.type === "note") {
    const content = request.content;
    const tag = request.tag;
    const pageUrl = request.pageUrl;

    const requesterTab = sender.tab;
    return true;
  }

  return true;
}

chrome.storage.onChanged.addListener(recordingStateListener);
chrome.runtime.onMessage.addListener(messageListener);

/*document.addEventListener('DOMContentLoaded', function() {
  chrome.windows.create({
    url: "http://www.google.com",
    type: "normal"
  });
});*/