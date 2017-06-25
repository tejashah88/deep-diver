const db = chrome.storage.sync;

$(document).ready(function (){
  diveID = getDiveID();
  displayDive(diveID);
});

function getDiveID () {
  return window.location.search.substring(9);
};

function displayDive(diveID) {
  db.get(['dives'], function(result) {
    diveObj = result.dives[diveID]
    parseAndPrintDive(diveObj);
  });
}

function printNotes(note, id) {
   $("#page" + note.PageID).append('<div id=note' + id + '> ' + note.Content + '</div>');
}

function printPage(dive, page, id, parentPage) {
   if (parentPage == null) {
      $(".pages").append('<div id=page' + id + '> <a href="' + page.url + '">' + page.url + "</a> ");
   } else {
      $("#page" + parentPage).append('<div id=page' + id + '> <a href="' + page.url + '">' + page.url + "</a> ");
   }

   $.each(page.Notes, function(k, v) {
      printNotes(dive.Notes[v], v);
   });

   $.each(page["ChildrenID"], function(k, v) {
      printPage(dive.Pages[v], v, id);
   });
}

function parseAndPrintDive(dive) {
  document.title = dive.title;

  $.each(dive.pages, function(k, v) {
    v["ChildrenID"] = [];
  });

  $.each(dive.pages, function(k, v) {
    if (v.ParentPageID != null){
      dive.Pages[v.ParentPageID]["ChildrenID"].push(k);
    }
  });

  $.each(dive.pages, function(k, v) {
    if (v.ParentPageID == null) {
      printPage(dive, v, k, null);
    }
  });
}