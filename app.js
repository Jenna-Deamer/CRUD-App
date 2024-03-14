let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let index = require('./controllers/index');
let users = require('./controllers/users');

//custom controllers
let transactions = require('./controllers/transactions');

//custom imports 
let mongoose = require('mongoose');
let dotenv = require('dotenv');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//if app is not in production mode, connect to .env file for global vars
//these global vars set in the Render dashboard in production mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
};

// mongodb connection before controller included
mongoose.connect(process.env.CONNECTION_string)
  .then((res) => { console.log('connected to MongoDB') })
  .catch((err) => { console.log('MongoDB connection failed') });

app.use('/', index);
app.use('/users', users);
app.use('/transactions', transactions); 
//use the transactions controller for /transactions requests


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;