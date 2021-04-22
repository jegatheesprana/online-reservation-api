const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = requie('jsonwebtoken');

const app = express();

dotenv.config();

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(console.log);

// Bodyparser
//parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//parse JSON bodies (as sent by API clients)
app.use(express.json());

// for cross origin request
app.use(cors())

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//jwt


//Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))