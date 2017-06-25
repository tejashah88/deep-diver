const db = chrome.storage.sync;

// Initialize isRecording
var isRecording = null;
db.get('active_dive', (result) => isRecording = !!result.active_dive);

var startTime, endTime;

var url_clicks = [];
var notes = [];


// Returns index of pages array that matches url
function getPageForURL(pages, url) {
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].url == url) {
      return i;
    }
  }
  return -1;
}

function transformDataToStruct(notes, url_clicks) {
  const pages = [];

  // First create all of our pages with links to notes
  for(let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const pageIndex = getPageForURL(pages, note.pageUrl);
    if (pageIndex != -1) {
      // Page already exists, let's modify it
      const currentPage = pages[pageIndex];
      pageIndex.notes.push(i)
    } else {
      // Let's create the page
      pages.push({
        url: note.pageURL,
        notes: [i],
        parentPageID: null // Will connect this below
      });
    }
  }

  // Now let's link pages together
  for (url_click of url_clicks) {
    const parentPageIndex = getPageForURL(pages, url_click.parentURL);
    const childPageIndex = getPageForURL(pages, url_click.childURL);
    if (childPageIndex != -1) {
      pages[childPageIndex].parentPageID = parentPageIndex;
    }
  }

  db.get('active_dive', (result) => {
    const active_dive_id = result.active_dive;

    const toWrite = {
      notes: notes,
      pages: pages
    };

    db.set(toWrite, () => console.log('notes/pages saved'));
  });
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === "sync" && 'active_dive' in changes) {
    isRecording = !!changes['active_dive'].newValue;
    console.log("New recording,", isRecording);
    if (!isRecording) {
      // We just stopped recording, let's write data
      console.log('we just stopped recording');
      transformDataToStruct(notes, url_clicks);
    }
  }
});

function messageListener(request, sender, sendResponse) {
  if (!isRecording)
    return true;

  if (request.type === "note") {
    const content = request.content;
    const tag = request.tag;
    const pageUrl = request.pageUrl;
    const timestamp = request.timestamp;

    notes.push({
      content: content,
      tag: tag,
      pageUrl: pageUrl,
      timestamp: timestamp
    });

    const requesterTab = sender.tab;
    return true;
  } else if (request.type === "url-clicked") {
    if (isRecording){
      url_clicks.push(request);
    }
    return true;
  }

  return true;
}

function tabClosedListener(tabId, removeInfo) {
  transformDataToStruct(notes, url_clicks);
}

chrome.runtime.onMessage.addListener(messageListener);
chrome.tabs.onRemoved.addListener(tabClosedListener)
