var requirejs = require('requirejs');
requirejs.config({
  nodeRequire: require
});

var config = requirejs('./config');
config.baseUrl = 'app/';
requirejs.config(config);

var argv = require('optimist').argv;

var express = require('express')
  , cons = require('consolidate')
  , http = require('http')
  , path = require('path');


global.isServer = true;
global.backdropUrl = argv.BACKDROP_URL || 'http://publicapi.dev.gov.uk/';
global.requireBaseUrl = argv.REQUIRE_BASE_URL || '/limelight/js';


var $ = global.$ = global.jQuery = require('jquery');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
$.support.cors = true;
$.ajaxSettings.xhr = function () {
    return new XMLHttpRequest;
}


var routes = requirejs('./routes');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
  app.use(app.router);
  app.use('/limelight/js', express.static(path.join(__dirname)));
  app.use('/limelight/js', express.static(path.join(__dirname, '..', 'test')));
  app.use('/limelight/js', express.static(path.join(__dirname, '..', 'dist')));
  app.use('/limelight', express.static(path.join(__dirname, '..', 'public')));
  app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.get('/jasmine', express.static(path.join(__dirname, '_SpecRunner.html')))
});

routes(app);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


exports = module.exports = server;

exports.use = function() {
	app.use.apply(app, arguments);
};