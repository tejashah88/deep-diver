chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('received request', request);
    const note = request.note;
    const requesterTab = sender.tab;
});