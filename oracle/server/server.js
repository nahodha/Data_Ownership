'use strict';

require('dotenv').config();

const express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      cookieParser = require('cookie-parser'),
      flash = require('connect-flash'),
      validator = require('express-validator'),
      morgan = require('morgan'),
      mongoose = require('mongoose'),
      MongoDBStore = require('connect-mongodb-session')(session),
      passport = require('passport'),
      local_strategy = require('./config/passport_local'),
      _ = require('lodash');


// Initialize mongodb connection
let mongoDB = 'mongodb://' + process.env.MONGO_CONNECTION + '/' + process.env.MONGO_MAIN_DB;
mongoose.connect(mongoDB, function(err) {
  if (err) throw err;

  console.log('MongoDB successfully connected!');
});

var store = new MongoDBStore({
  uri: 'mongodb://' + process.env.MONGO_CONNECTION + '/' + process.env.MONGO_SESSION_DB,
  databaseName: process.env.MONGO_SESSION_DB,
  collection: process.env.MONGO_SESSION_COLLECTION
  },
  function(err) {
    // Should have gotten an error
    if (err) {
      console.error('ERROR CONNECTING connect-mongo-store\n\n' + err);
      throw err;
    }
});

store.on('error', function(err) {
  // Also get an error here
  console.error('ERROR CONNECTING connect-mongo-store\n\n' + err);
});


// Defualt db connection
let db = mongoose.connection;

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;


app.use(morgan('combined'));

app.use(cookieParser(process.env.COOKIE_KEY));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(validator());

// set up session cookies
app.use(session({
  secret: process.env.COOKIE_KEY,
  resave: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: true
  },
  saveUninitialized: false,
  store: store
}));

// instantiate connect-flash
app.use(flash());

app.use((req, res, next) => {
  const errors = req.flash('error');
  const success = req.flash('success');
  const messages = [];

  messages.push(errors);
  messages.push(success);

  res.locals.hasErrors = errors.length > 0;
  res.locals.hasSuccess = success.length > 0;
  res.locals.messages = messages;

  next();
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

local_strategy(passport);

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.active = '';
  next();
});

// setup routes
const routes = require('./routes/index');

app.use(routes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({success: false, message: 'Server Error'});
});

app.locals._ = _;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => console.log('App listening on http://localhost:' + PORT));
