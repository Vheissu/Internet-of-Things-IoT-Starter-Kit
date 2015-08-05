// Express and middleware additions
var express = require('express');
var logger  = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

// Node specific plugins
var http = require('http');
var path = require('path');

// Database plugins
var mongo = require('mongodb');
var monk  = require('monk');
var db    = monk('localhost:27017/iot-starter-kit');

// Start Express server
var app = express();

// Pass through Monk DB layer to all requests so we can query within routes
app.use(function(req, res, next) {
    req.db = db;
    next(); 
});

// Configure Express
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', routes.index);
app.get('/sensor/:slug', routes.sensor);

app.post('/sensor/new', routes.sensorNewPost);

// Catch 404 errors
app.use(function(req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'Iot Starter Kit | Error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'Iot Starter Kit | Error'
    });
});

app.listen(app.get('port'), function() {
    console.log('Iot server listening on port ' + app.get('port'));
});

module.exports = app;