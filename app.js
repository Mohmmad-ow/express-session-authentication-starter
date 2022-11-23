const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
const MongoStore = require('connect-mongo')
var crypto = require('crypto');
var routes = require('./routes');
const {connection} = require('./config/database');

// Package documentation - https://www.npmjs.com/package/connect-mongo


// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

/**
 * -------------- GENERAL SETUP ----------------
 */




// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();
const mongoUrl = process.env.DB_STRING
// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

    
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true
        }
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 24 * 60 * 60}
}))
// TODO
/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);