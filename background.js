chrome.browserAction.onClicked.addListener(function(tab) { alert('icon clicked')});

document.addEventListener('DOMContentLoaded', function() {
  //renderStatus('LOL');
  console.log("LOL");
});


function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}