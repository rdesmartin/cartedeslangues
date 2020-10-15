require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var favicon = require('serve-favicon')

var indexRouter = require('./routes/index');


// connect to mongodb
const host = process.env.MONGO_HOST
const port = process.env.MONGO_PORT
const db = process.env.MONGO_DB
const user = process.env.MONGO_USER
const pwd = process.env.MONGO_PWD

var client = mongoose.connect(`mongodb://${user}:${pwd}@${host}:${port}/${db}`, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch(err => {
    console.log("Error: init app:");
    console.log(err);
  });

// init express app
var app = express();

// setup serve-favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
