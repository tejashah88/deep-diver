chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.request == 'get-active-dive') {
      chrome.storage.sync.get('active_dive', (result) => {
        const active_dive = result.active_dive;
        sendResponse({active_dive: active_dive});
        return true;
      });
    }

    const note = request.note;
    const requesterTab = sender.tab;
    return true;
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

class Dive {
  constructor(title) {
    this.title = title;
    this.pages = [];
    this.notes = [];
  }

  startRecording() {
    this.startTime = Date.now();
    this.id = "dive_" + this.startTime;
  }

  stopRecording() {
    this.endTime = Date.now();
  }

  addNote(note) {
    this.notes.push(note);
  }

  addPage(page) {
    this.pages.push(page);
  }

  exportToJson() {
    var json = {
      title: this.title,
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      pages: [],
      notes: []
    }

    for (var page of this.pages) {
      json.pages.push(page.exportToJson());
    }

    for (var note of this.notes) {
      json.notes.push(note.exportToJson());
    }
  }
}

class Page {
  constructor(params) {
    this.url = params.url;
    this.parentPageId = params.parentPageId;
    this.noteRefs = [];
  }

  addNoteRef(ref) {
    this.noteRefs.push(ref);
  }

  addNoteRefs(refs) {
    this.noteRefs.push(...refs);
  }

  exportToJson() {
    var json = {
      url: this.url,
      parentPageId: this.parentPageId,
      notes: []
    };

    for (var noteRef of this.noteRefs) {
      json.notes.push(noteRef.exportToJson());
    }

    return json;
  }
}

class Note {
  constructor(tag, content, pageId) {
    this.tag = tag;
    this.content = content;
    this.pageId = pageId;
    this.timestamp = Date.now();
  }

  exportToJson() {
    return {
      tag: this.tag,
      content: this.content,
      pageId: this.pageId,
      timestamp: this.timestamp
    };
  }
}