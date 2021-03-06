/**
 * Module dependencies.
 */
var express = require('express')
  , api = require('etherpad-lite-client')
  , routes = require('./routes')
  , words = require('./routes/words')
  , http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var etherpad = api.connect({
  apikey: process.env.ETHERPAD_SECRET,
  host: process.env.ETHERPAD_HOST || '127.0.0.1',
  port: process.env.ETHERPAD_PORT || 9001
});
app.set('etherpad', etherpad);

app.get('/', routes.index);
app.get('/api/top', words.top);
app.get('/api/words', words.list);
app.get('/api/words/:word', words.detail);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
