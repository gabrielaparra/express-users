const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
//The passport middlewares have to go after the session middleware
const passport     = require('passport');

require('./config/passport-config.js');
//Run the code written in passport-config.js

mongoose.connect('mongodb://localhost/express-users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
// express-session, the value of 'secret' doesn't matter except
// it has to be different for every app.
app.use(session({
  secret: 'sjhjahsjka',
  resave: true,
  saveUninitialized: true
})); //Parentheses: 1 for app.use and another for 'session()'

//---------PASSPORT MIDDLEWARES-------------------

app.use(passport.initialize());
app.use(passport.session());
//These need to come after app.use(session(...)) since
//session() is used here.

//------------------------------------------------

//---------------CURRENT USER---------------------
//This middleware creates the 'currentUser' for ALL views
//if the user is logged in

app.use((req, res, next) => {
  //'req.user' is defined by the passport middleware
  //if the user is logged in, 'req.user' will be empty
  if (req.user) {
    // Create the 'currentUser' local var for all views
    res.locals.currentUser = req.user;
  }
  next();
  //if we don't do 'load' the pages will load forever
});

//------------------------------------------------

//---------------ROUTES---------------------------

const index = require('./routes/index');
app.use('/', index);

const authorizationRoutes = require('./routes/authorization-routes.js');
app.use('/', authorizationRoutes);

const roomRoutes = require('./routes/room-routes.js');
app.use('/', roomRoutes);

//------------------------------------------------

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
