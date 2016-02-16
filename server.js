'use strict';

var express = require('express');

/**
 * Main application file
 */

// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express();

if (process.env.NODE_ENV == 'development') {
  app.get('/*', function(req, res, next) {
    if (!req.headers.host.match(/^www/)) {
      res.redirect('http://www.' + req.headers.host + req.url);
    } else {
      next();
    }
  })
}

app.use(require('prerender-node').set('prerenderToken', '3iULJkT9S6jMjdwulf9h'));

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
