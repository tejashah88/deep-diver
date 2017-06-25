const db = chrome.storage.sync;

$( document ).ready(function() {
  loadMainButton();
  loadDives();
});

function loadMainButton() {
  $('#active-dive').empty();

  db.get('active_dive', function(result) {
    var shouldAddStopButton = result && result.active_dive !== null;
    $('#active-dive').append(shouldAddStopButton ? stopDiveButton() : startDiveButton());
  });
}

function loadDives() {
  const dives = ['Mr. Robot Dive', 'Pizza Dive', 'In N Out Dive'];
  dives.forEach(function(diveId) {
    $('#past-dives').append(
      $('<button>')
      .addClass('btn btn-default btn-primary btn-sm btn-block')
      .attr('href', '#')
      .text(diveId)
      .click(function() {
        chrome.tabs.create({ url: '../html/dive_visualization.html?dive_id=' + diveId });
      })
    );
  });
}

function startDiveButton() {
  return $("<button>")
    .attr('id', 'start-dive')
    .addClass('btn btn-success btn-circle')
    .text('Start')
    .click(function() {
      const key = Date.now();
      const dive = {
        title: "Fuck yeah",
        pages: [],
        startTime: key,
        endTime: null
      };

      db.get('dives', function(result) {
        const dives = result.dives || new Object();
        dives.key = dive;

        db.set({'active_dive': key, 'dives': dives}, function() {
          loadMainButton();
        });
      });
    });
}

function stopDiveButton() {
  return $("<button>")
    .attr('id', 'stop-dive')
    .addClass('btn btn-danger btn-circle')
    .text('Stop')
    .click(function() {
      db.get(['active_dive', 'dives'], function(result) {
        const key = result.active_dive;
        const dives = result.dives
        dives.key.endTime = Date.now();

        db.set({'active_dive': null, 'dives': dives}, function() {
          loadMainButton();
        });
      });
    });
}
