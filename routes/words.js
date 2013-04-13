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
  var occurences = 1; // init occurences variable
  etherpad.listAllPads(function(err, data) {
    if (err) return next(err.message);
    data.padIDs.forEach(function(padID){
      var rev = [];
      rev.padID = padID;
      //console.log(util.inspect(arrayTest));
      etherpad.getText(rev, function(err, data) {
        if (err) return next(err.message);
        occurences += countWordOccurencesInContentPad(data, word); // increments number of occurences for each pad
        console.log(occurences);
      });
    });
  });
  res.send({
    word: {
      "occurences": occurences
    }
  });
};

/**
* count the occurence of the word in the content with a regexp
*
* @param object content
* @param string word
* @return int number of occurences
*/
function countWordOccurencesInContentPad(content, word) {
  var text = content.text;
  var regex = new RegExp( word, 'g' ); // g = search in global text
  var count = text.match(regex); // match the regex
  if (count !== null) { // if results exists
    return count.length; // return number of occurences
  } else {
    return 0; // 0 occurence of the word in the pad
  }
}