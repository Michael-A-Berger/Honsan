// Importing Node libraries
const path = require('path');
const url = require('url');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// const csurf = require('csurf');
const router = require('./router.js');

// Getting the environment variables
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/HonsanDB';

// Connecting the MongoDB instance
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Getting the Redsi connection information
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};
let redisPASS;
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.substr(redisURL.auth.indexOf(':') + 1);
}

// Defining the Express application
const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/media/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Tama Neko',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

// Preventing CSRF session hijacking
// app.use(csurf());
// app.use((err, rq, rp, next) => {
//   if (err.code !== 'EBADCSRFTOKEN') return next(err);
//   console.log('Missing CSRF token');
//   return false;
// });

// Setting the app resource routes
router(app);

// Turning on the server
app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Listening on port ${port}...`);
});
