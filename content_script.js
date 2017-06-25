const db = chrome.storage.sync;

let tagInput = null;
function setupTagInput() {
  tagInput = document.createElement("input");
  tagInput.setAttribute("type", "text")
  tagInput.style.position = 'absolute';
  tagInput.style["z-index"] = 10000;
  tagInput.style.display = "none";
  tagInput.style.border = "1px solid #ccc";
  tagInput.style["border-radius"] = "4px";
  tagInput.placeholder = "Enter a tag...";
  tagInput.style.width = "120px";
  tagInput.style.padding = "2px";
  document.body.appendChild(tagInput);
}

function keyDownListener(e) {
  if (e.which == 27) {
    tagInput.style.display = "none";
  }
}

function keyPressListener(e) {
  if (e.which == 13) {
    // Enter pressed
    console.log('Adding a tag...', e.target.value);
    const messageRequest = {
      type: "note"
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
    const topOffset = rect.top + document.body.scrollTop;
    const leftOffset = rect.right + document.body.scrollLeft;
    tagInput.style.top = `${topOffset}px`;
    tagInput.style.left = `${leftOffset}px`;
    tagInput.style.display = "block";
    tagInput.value = "";
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
