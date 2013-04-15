var WordCounter = require('../lib/wordcounter.js');
var removeDiacitics = require('../lib/remove-diacritics.js');

exports.top = function(req, res, next) {
  var limit = Math.min(
    parseInt(req.query.limit, 10) || 10,
    100
  ); // Limit to 100 items
  var etherpad = req.app.get('etherpad');

  getAllPads(etherpad, function(err, pads) {
    if (err) return next(err);

    var ranking = makeRanking(pads, limit);
    res.json(ranking);
  });
};

exports.list = function(req, res, next) {
  var filter = canonicalWord(req.query.q || ''),
      limit  = Math.min(parseInt(req.query.limit, 10) || 10, 100); // Limit to 100 items
  var etherpad = req.app.get('etherpad');

  getAllPads(etherpad, function(err, pads) {
    if (err) return next(err);

    var ranking = makeRanking(pads),
        words = {};
    for (var key in ranking) {
      if (filter && key.indexOf(filter) === -1) continue;
      words[key] = ranking[key];
    }
    res.json(words);
  });
};

exports.detail = function(req, res, next) {
  var key = canonicalWord(req.params.word);
  var etherpad = req.app.get('etherpad');

  getAllPads(etherpad, function(err, pads) {
    if (err) return next(err);

    var ranking = makeRanking(pads),
        word = ranking[key];
    res.json(word || { occurrences: 0 });
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


var wordRegEx = /[\wÀ-ÿ\-'’]+/gi;

function makeRanking(pads, size) {
  var words = findWords(pads);

  // Sort words
  var sortable = [];
  for (var key in words)
    sortable.push([words[key].occurrences, key]);
  sortable.sort(function(a, b) {
    return b[0] - a[0]; // reverse sorting order
  });

  // Build ranking
  var ranking = {};
  sortable.slice(0, size).forEach(function(item, index) {
    var key = item[1],
        word = words[key];
    word.rank = index + 1;
    ranking[key] = word;
  });
  return ranking;
}


function findWords(pads) {
  var words = {};

  pads.forEach(function(pad) {
    // Find words
    var matches = pad.text.match(wordRegEx);
    matches.forEach(function(match) {
      // Accumulate words couting occurrences
      var canonical = canonicalWord(match),
          word = words[canonical];
      if (!word) {
        word = words[canonical] = {
          occurrences: 0,
          rank: null,
          forms: []
        };
      }
      word.occurrences++;
      // Keep various forms (with diacritics, etc)
      if (word.forms.indexOf(match) === -1)
        word.forms.push(match);
    });
  });

  return words;
}


function canonicalWord(word) {
  return removeDiacitics(word).toLowerCase();
}
