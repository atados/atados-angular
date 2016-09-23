'use strict';

/* jshint unused: false */

var app = angular.module('atadosApp');

app.controller('ProjectEditCtrl', function($scope, $state, $stateParams, project) {
  $scope.loadedProject = project;
});
