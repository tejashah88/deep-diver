const tagInput = document.createElement("input");
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

document.addEventListener('keypress', (e) => {
    if (e.which == 27) {
        tagInput.style.display = "none";
    }
});

tagInput.addEventListener('keypress', (e) => {
    if (e.which == 13) {
        // Enter pressed
        console.log('Add tag...', e.target.value);
        const messageRequest = {
            note: e.target.value
        };
        chrome.runtime.sendMessage(messageRequest, (response) => {
            console.log(response);
        });
    }
});

document.addEventListener('mouseup', (event) => {
    const currentSelection = document.getSelection().toString();
    if (currentSelection !== "") {
        // There is text currently selected
        const rect = document.getSelection().getRangeAt(0).getBoundingClientRect();
        const topOffset = rect.top + document.body.scrollTop;
        const leftOffset = rect.right + document.body.scrollLeft;
        tagInput.style.top = `${topOffset}px`;
        tagInput.style.left = `${leftOffset}px`;
        tagInput.style.display = "block";
    }
    else if (event.target !== tagInput) {
        tagInput.style.display = "none";
    }
});

