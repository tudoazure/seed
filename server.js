
/**
 * Module dependencies.
 */

var express = require('express');
var util = require('util');
var http = require('http');
var path = require('path');
var proc = require('ptmproc');
var oauth = require('./routes/lib/oauth');

var app = express();
app.configure(function () {
// all environments
    app.set('port', process.env.PORT || 4199);
 
    app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, '.tmp')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');

    app.engine('.html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());

    app.configure('development', function() {
    app.use(express.session({
        secret: '4a5b6c7d8e9f',
        key: 'bargain.sid'
      }));
    });

    app.configure('production', function() {
      var RedisStore = require('connect-redis')(express);
      app.use(express.session({
        key: 'bargain.sid',
        store: new RedisStore(),
        secret: '4a5b6c7d8e9f'
      }));
    });

    app.use(oauth.isLogin);
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'app')));

// development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
    
    require('./routes')(app); // initializes all routes(executes routes/index.js)

});
http.createServer(app)
    .on('error',function(err) {
        util.log(err);
        process.exit(1);
    })
    .listen(app.get('port'), function() {
        util.log("Bargain Panel Server listening on port " + app.get('port') + ' in ' + (process.env.NODE_ENV || 'development' ));
    });

// initializes process management
proc.init(app);
