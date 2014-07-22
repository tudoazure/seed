
/**
 * Module dependencies.
 */

var express = require('express');
var util = require('util');
var http = require('http');
var path = require('path');
var proc = require('ptmproc');
var connectAssets = require('connect-assets');
var oauth = require('./routes/lib/oauth');

var app = express();
app.configure(function () {
// all environments
    app.set('port', process.env.PORT || 4199);
    app.use(connectAssets()); 
    app.set('views', path.join(__dirname, 'app/views'));
    app.engine('.html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.favicon());
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
    app.use(express.static(path.join(__dirname, 'public')));

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
