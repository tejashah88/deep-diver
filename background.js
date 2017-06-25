chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('received request', request);
    const note = request.note;
    const requesterTab = sender.tab;
});

var isRecording = false;

var startTime, endTime;

function contextMenuOnCreated() {
  if (chrome.runtime.lastError) {
    console.log("error creating item:" + chrome.runtime.lastError);
  } else {
    console.log("item created successfully");
  }
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // check if it's the correct context menu item
  if (info.menuItemId === "toggleRecordingState") {
    isRecording = info.checked; // this will be guaranteed to toggle

    /*chrome.contextMenus.update(
      "toggleRecordingState",
      {
        //title: "Recording On",
        checked: isRecording
      }
    );*/

    if (isRecording) {
      startTime = Date.now();
    } else {
      // assuming we were already recording at this time...
      endTime = Date.now();

      // perform a search for all history links between startTime and endTime
      chrome.history.search({
        text: "",
        startTime: startTime,
        endTime: endTime
      }, function(historyResults) {
        for (var hresult of historyResults) {
          chrome.history.getVisits({ url: hresult.url }, function(visitResults) {
            console.log(JSON.stringify({
              id: hresult.id,
              type: visitResults[0].transition,
              url: hresult.url,
              lastVisitTime: hresult.lastVisitTime
            }, null, 2));
          });
        }
      });
    }
  }
});


function setupContextMenu() {
  chrome.contextMenus.create({
    id: "toggleRecordingState",
    type: "checkbox",
    title: "Recording Enabled",
    contexts: ["all"],
    checked: false
  }, contextMenuOnCreated);
}

setupContextMenu();

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

document.addEventListener('DOMContentLoaded', function() {
  chrome.windows.create({
    url: "chrome://newtab",
    type: "normal"
  });
});