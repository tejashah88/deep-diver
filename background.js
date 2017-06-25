chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('received request', request);
    const note = request.note;
    const requesterTab = sender.tab;
});

var isRecording = false;

var startTime, endTime;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // changeInfo.url;
})

/*chrome.browserAction.onClicked.addListener(function(tab) {
  isRecording = !isRecording;
  alert('icon clicked: ' + isRecording);
  renderStatus('LOL');
});*/

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

/*document.addEventListener('DOMContentLoaded', function() {
  chrome.windows.create({
    url: "chrome://newtab",
    type: "normal"
  });
});*/

/*class Dive {
  constructor(title) {
    this.title = title;
    this.id = "dive_" + Date.now();
    this.startTime = Date.now();
    this.endTime = null;
    this.pages = [];
    this.notes = [];
  }

  addNote(note) {
    this.notes.push(note);
  }

  addPage(page) {
    this.pages.push(page);
  }

  exportToJson() {
    return //something;
  }
}

class Page {
  constructor(url, parentPage) {
    this.url = url;
    this.parentPage = parentPage;
  }
}

class Note {
  constructor(tag, content, pageId) {
    this.tag = tag;
    this.content = content;
    this.pageId = pageId;
    this.timestamp = Date.now();
  }
}

function createDiveObject(title) {
  return {
    title: title
    startTime: Date.now(),
    endTime: null,
    pages: []
  };
}*/