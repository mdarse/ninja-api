// WordCounter object is used to count occurences of a word in provided text

function WordCounter(word) {
  this.occurrences = 0;
  this.regex = new RegExp(word, 'gi'); // g = global search, i = case insensitive
}

WordCounter.prototype.addText = function(text) {
  var matches = text.match(this.regex);
  this.occurrences += (matches === null) ? 0 : matches.length;
};

WordCounter.prototype.getOccurrences = function() {
  return this.occurrences;
};

module.exports = WordCounter;
