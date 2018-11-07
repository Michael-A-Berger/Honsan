// Importing Node libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const router = require('./router.js');

// Getting the environment variables
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Defining the Express application
const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/media/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

// Setting the app resource routes
router(app);

// Turning on the server
app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Listening on port ${port}...`);
});
