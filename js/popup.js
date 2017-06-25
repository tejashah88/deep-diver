const db = chrome.storage.sync;

$(document).ready(function() {
  loadMainButton();
  loadDives();
});

function loadMainButton() {
  $('#active-dive').empty();

  db.get(['active_dive', 'dives'], function(result) {
    var shouldShowStopButton = result && result.active_dive;
    console.log('active_dive', result);
    if (shouldShowStopButton) {
      $('#dive-title-input').val(result.dives[result.active_dive].title);
      $('#dive-title-input').prop('disabled', true);
    }
    $('#active-dive').append(shouldShowStopButton ? stopDiveButton() : startDiveButton());
  });
}

function loadDives() {
  db.get('dives', function(result) {
    if (result && result.dives) {
      Object.keys(result.dives).forEach(function (key) {
        $('#past-dives').append(
          $('<button>')
          .addClass('btn btn-default btn-primary btn-sm btn-block')
          .attr('href', '#')
          .text(result.dives[key].title)
          .click(function() {
            chrome.tabs.create({ url: '../html/dive_visualization.html?dive_id=' + key });
          })
        );
      });
    }
  });
}

function startDiveButton() {
  return $("<button>")
    .attr('id', 'start-dive')
    .addClass('btn btn-success btn-circle')
    .text('Start')
    .click(function() {
      $('#dive-title-input').prop('disabled', true);

      const key = Date.now();
      const dive = {
        title: $('#dive-title-input').val(),
        pages: [],
        startTime: key,
        endTime: null
      };

      db.get('dives', function(result) {
        const dives = result.dives || new Object();
        dives[key] = dive;

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
      $('#dive-title-input').val('');
      $('#dive-title-input').prop('disabled', false);

      db.get(['active_dive', 'dives'], function(result) {
        const key = result.active_dive;
        const dives = result.dives
        dives[key].endTime = Date.now();

        db.set({'active_dive': null, 'dives': dives}, function() {
          loadMainButton();
        });
      });
    });
}