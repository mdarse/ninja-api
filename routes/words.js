
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
  etherpad.listAllPads(function(err, data) {
    if (err) return next(err.message);
    // DOES NOT WORKS
    // data.padIDs.forEach(function(padID) {
    //   etherpad.getText(padID, function(err, data) {
    //     if (err) return next(err.message);
    //     // Work with content
    //   });
    // });
    res.json(data.padIDs);
  });
};
