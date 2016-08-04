'use strict';

/* global toastr: false */
/* jshint unused: false */

var app = angular.module('atadosApp');

app.controller('ProjectEditCtrl', function($scope, $state, $stateParams, Restangular, Project, Photos, NONPROFIT, saoPaulo, Auth, project) {
  $scope.loadedProject = project;
});
