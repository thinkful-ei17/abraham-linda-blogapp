'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const storiesRouterV1 = require('./routers/v1/stories-router');
const storiesRouterV2 = require('./routers/v2/stories-router');
const authorsRouterV2 = require('./routers/v2/authors-router');
const storiesRouterV3 = require('./routers/v3/stories-router');
const authorsRouterV3 = require('./routers/v3/authors-router');
const tagsRouter = require('./routers/v3/tags-router');
const { PORT } = require('./config');

const app = express();

app.use(morgan('common'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.redirect('/v3');
  }
);

app.use('/api/v1', storiesRouterV1);
app.use('/api/v2', storiesRouterV2);
app.use('/api/v2', authorsRouterV2);
app.use('/api/v3', storiesRouterV3);
app.use('/api/v3', authorsRouterV3);
app.use('/api/v3', tagsRouter);


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
