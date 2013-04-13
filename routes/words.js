// call async module
var async = require('async');

// call util module
var util = require('util');

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
    async.forEach(data.padIDs, function (padID, callback) {
      var Request = [];
      Request.padID = padID;
      //console.log(util.inspect(arrayTest));
      etherpad.getText(arrayTest, function(err, data) {
        if (err) return next(err.message);
        // Display content
        console.log(data);
      });
    },
    function(err) {
      return next(err.message);
    });

    //res.json(data.padIDs);
  });
};