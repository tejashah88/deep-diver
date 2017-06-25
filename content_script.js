const db = chrome.storage.sync;

let tagInput = null;
let lastTag = '';

window.onload = function() {
  var observed = document.getElementsByTagName('a');

  for (var i = 0; i < observed.length; i++) {
    observed[i].addEventListener('click', function (e) {
      var e = window.event || e;
      sendUrlInfo();
      //alert('Clicked ' + e.srcElement.innerText);

      //if (e.preventDefault) { e.preventDefault() } else { e.returnValue = false; }
    }, false);
  }
}


function setupTagInput() {
  tagInput = document.createElement("input");
  tagInput.setAttribute("type", "text");
  tagInput.className += "form-control";
  tagInput.setAttribute("id", "tagInput");
  tagInput.style.position = 'absolute';
  tagInput.style["z-index"] = 10000;
  tagInput.placeholder = "Enter a tag...";
  tagInput.style.width = "140px";
  document.body.appendChild(tagInput);
  $("#tagInput").wrap("<span>$</span>")
}

function getAllLinksInPage() {
  var urls = [];

  for (var i = document.links.length; i-- > 0;)
    urls.push(document.links[i].href);
  
  return urls;
}

function getCurrentUrl() {
  return document.URL;
}

function keyDownListener(e) {
  if (e.which == 27) {
    tagInput.style.display = "none";
  }
}

function sendUrlInfo() {
  const messageRequest = {
    type: "url",
    timestamp: Date.now(),
    currentUrl: getCurrentUrl(),
    nestedUrls: getAllLinksInPage()
  };

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
      content: document.getSelection().toString(),
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
    const rect = document.getSelection().getRangeAt(0).getBoundingClientRect();
    const topOffset = rect.top + document.body.scrollTop - 10;
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
