'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const storiesRouter = require('./routers/stories-router');
const { PORT } = require('./config');

const app = express();

app.use(morgan('common'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use('/api/v1', storiesRouter);

// Catch-all endpoint for requests to non-existent endpoint
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all endpoint for errors
// Prevent stacktrace from being leaked to user in production
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

const server = app
  .listen(PORT, () => {
    console.info(`App listening on port ${server.address().port}`);
  })
  .on('error', err => {
    console.error(err);
  });
