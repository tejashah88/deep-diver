const db = chrome.storage.sync;

$(document).ready(function (){
  diveID = getDiveID();
});

function getDiveID () {
  return window.location.search.substring(9);
};