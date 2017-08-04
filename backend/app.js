/////////////////// Our additions
const createNamespace = require("continuation-local-storage").createNamespace;
const expressNamespace = createNamespace("express");
/////////////////// End of our additions

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
// var users = require('./routes/users');

/////////////////// Our additions
const pool = require('./models/pool');
const cUser = require('./controllers/user');
/////////////////// End of our additions

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/////////////////// Our additions
// Store req and res for easy reference. We can now logout anywhere.
app.use((req, res, next) => {
  expressNamespace.bindEmitter(req);
  expressNamespace.bindEmitter(res);
  expressNamespace.run(() => {
    expressNamespace.set("req", req);
    expressNamespace.set("res", res);
    next();
  });
});
pool.init(app);
cUser.init(app);
// Allow access from :3001 which is where our frontend is.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
/////////////////// End of our additions

app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;