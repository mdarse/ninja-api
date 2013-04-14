var WordCounter = require('../lib/wordcounter.js');

exports.top = function(req, res) {
  res.json({
    "ninja": {
      "occurrences": 125,
      "rank": 1
    },
    "saucisse": {
      "occurrences": 76,
      "rank": 2
    }
  });
};

exports.list = function(req, res) {
  res.json({
    "caca": {
      "occurrences": 2,
      "rank": 75
    },
    "cacahuete": {
      "occurrences": 31,
      "rank": 24
    },
    "cacao": {
      "occurrences": 12,
      "rank": 51
    }
  });
};

exports.detail = function(req, res, next) {
  var word = req.params.word;
  var etherpad = req.app.get('etherpad');

  getAllPads(etherpad, function(err, pads) {
    if (err) return next(err);

    var wordCounter = new WordCounter(word);
    pads.forEach(function(pad) {
      wordCounter.addText(pad.text);
    });

    var data = {};
    data[word] = { occurrences: wordCounter.getOccurrences() };
    res.send(data);
  });
};


function getAllPads(etherpadClient, callback) {
  // Get all pad IDs
  etherpadClient.listAllPads(function(err, data) {
    if (err) return callback(err.message);
    var padIDs = data.padIDs || [],
        pads = [],
        remaining = padIDs.length;

    // With zero padIDs, callback will never be called
    if (padIDs.length === 0)
      return callback(null, []);

    // Get the text of each pad
    padIDs.forEach(function(padID) {
      etherpadClient.getText({ padID: padID }, function(err, data) {
        if (err) callback(err.message);
        pads.push({
          id: padID,
          text: data.text
        });
        // synchronization step when all pads are received
        if (--remaining === 0)
          callback(null, pads);
      });
    });
  });
}




