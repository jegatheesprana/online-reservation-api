"use strict";

var express = require('express');

var mongoose = require('mongoose');

var session = require('express-session');

var passport = require('passport');

var dotenv = require('dotenv');

var cors = require('cors');

var cookieParser = require('cookie-parser');

var app = express();
dotenv.config(); // Passport config

require('./config/passport')(passport); // DB Config


var db = require('./config/keys').MongoURI; //Connect to Mongo


mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('MongoDB connected');
})["catch"](console.log); // Bodyparser
//parse url-encoded bodies (as sent by HTML forms)

app.use(express.urlencoded({
  extended: false
})); //parse JSON bodies (as sent by API clients)

app.use(express.json()); // for cross origin request

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
})); // Express session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); // set cookie parse

app.use(cookieParser('secretcode')); // Passport middleware

app.use(passport.initialize());
app.use(passport.session()); //jwt
//Routes

app.use('/', require('./routes/index'));
var PORT = process.env.PORT || 8000;
app.listen(PORT, console.log("Server started on port ".concat(PORT)));