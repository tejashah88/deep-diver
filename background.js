const db = chrome.storage.sync;
var isRecording = false;
var startTime, endTime;

var pages = [];

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

var url_path_info = [];
var notes_info = [];

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === "sync") {
    var old_isRecording;
    isRecording = changes['active_dive'].newValue !== null;
    console.log("Recording is enabled: " + isRecording);
    /*if (old_isRecording !== isRecording) {
      if (isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    }*/
  }
});

function messageListener(request, sender, sendResponse) {
  if (!isRecording)
    return true;

  console.log("request.type == " + request.type)

  if (request.type === "note") {
    const content = request.content;
    const tag = request.tag;
    const pageUrl = request.pageUrl;
    const timestamp = request.timestamp;

    if (isRecording) {
      notes_info.push({
        content: content,
        tag: tag,
        pageUrl: pageUrl,
        timestamp: timestamp
      });
      console.log(notes_info);
    }

    const requesterTab = sender.tab;
    return true;
  } else if (request.type === "url") {
    const currUrl = request.currentUrl;
    const nestedUrls = request.nestedUrls;
    const timestamp = request.timestamp;

    if (isRecording){
      url_path_info.push(...[currUrl, nestedUrls, timestamp]);
      console.log(url_path_info);
    }

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