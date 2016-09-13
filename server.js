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
if (process.env.NODE_ENV === 'development') {
  app.listen(config.port, '0.0.0.0', function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
} else {
  var prj = null;
  process.argv.forEach(function (val, index, array) {
    if (val.indexOf('--prj') !== -1) {
      prj = val.split('=')[1];
    }
  });
  
  if (prj) {
    app.listen('/tmp/www.run.'+prj+'.socket', function () {
      console.log('Express server listening in %s mode', app.get('env'));
    });
  } else {
    console.log("Missing --prj flag");
  }
}

// Expose app
exports = module.exports = app;
