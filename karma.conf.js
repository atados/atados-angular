'use strict';

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/restangular/dist/restangular.js',
      'app/bower_components/angular-i18n/angular-locale_pt-br.js',
      'app/bower_components/angular-i18n/angular-locale_en-us.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-facebook/lib/angular-facebook.js',
      'app/bower_components/toastr/toastr.js',
      'app/bower_components/jquery.cookie/jquery.cookie.js',
      'http://maps.googleapis.com/maps/api/js?sensor=false&language=en&v=3.13',
      'app/bower_components/angular-google-maps/dist/angular-google-maps.js',
      'app/ui-bootstrap-0.6.0.js',
      'app/ui-bootstrap-tpls-0.6.0.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
