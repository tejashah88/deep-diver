const db = chrome.storage.sync;

let tagInput = null;
let lastTag = '';
let currentTextSelection = "";

window.onload = function() {
    var observed = document.getElementsByTagName('a');

    for (var i = 0; i < observed.length; i++) {
        observed[i].addEventListener('click', function (e) {
            debugger;
            sendUrlInfo(e.target.href);
        });
    }
}

function setupTagInput() {
  tagInput = document.createElement("input");
  tagInput.setAttribute("type", "text")
  tagInput.style.position = 'absolute';
  tagInput.style["z-index"] = 10000;
  tagInput.style.display = "none";
  tagInput.style.border = "2px solid #ccc";
  tagInput.style["border-radius"] = "4px";
  tagInput.placeholder = "Enter a tag...";
  tagInput.style.width = "120px";
  tagInput.style.padding = "5px";
  document.body.appendChild(tagInput);
}

function getAllLinksInPage() {
  var urls = [];

  for (var i = document.links.length; i-- > 0;)
    urls.push(document.links[i].href);
  
  return urls;
}

function getCurrentURL() {
  return document.URL;
}

function keyDownListener(e) {
  if (e.which == 27) {
    tagInput.style.display = "none";
  }
}

function sendUrlInfo(clickedOnURL) {
  const messageRequest = {
    type: "url-clicked",
    parentURL: getCurrentURL(),
    childURL: clickedOnURL,
    timestamp: Date.now()
  };

  debugger;

  console.log('sending url info....', messageRequest);

  chrome.runtime.sendMessage(messageRequest, (response) => {
    console.log(response);
  });
}

function keyPressListener(e) {
  if (e.which == 13) {
    // Enter pressed
    lastTag = e.target.value;
    console.log('Adding a tag...', e.target.value);

    const messageRequest = {
      type: "note",
      timestamp: Date.now(),
      tag: e.target.value,
      content: currentTextSelection,
      pageUrl: document.URL
    };

    chrome.runtime.sendMessage(messageRequest, (response) => {
      console.log(response);
    });
    
    tagInput.style.display = "none";
  }
}

function mouseupListener() {
  const currentSelection = document.getSelection().toString();
  if (currentSelection !== "") {
    // There is text currently selected
    currentTextSelection = currentSelection;
    const rect = document.getSelection().getRangeAt(0).getBoundingClientRect();
    const topOffset = rect.top + document.body.scrollTop;
    const leftOffset = rect.right + document.body.scrollLeft + 5;
    tagInput.style.top = `${topOffset}px`;
    tagInput.style.left = `${leftOffset}px`;
    tagInput.style.display = "block";
    tagInput.value = lastTag;
  }
  else if (event.target !== tagInput) {
    tagInput.style.display = "none";
  }
}

function setupDiveListeners() {
  document.addEventListener('keydown', keyDownListener);
  document.addEventListener('keypress', keyPressListener);
  document.addEventListener('mouseup', mouseupListener);
  setupTagInput();
}

db.get('active_dive', (result) => {
  if (result.active_dive) {
    setupDiveListeners();
  }
});
