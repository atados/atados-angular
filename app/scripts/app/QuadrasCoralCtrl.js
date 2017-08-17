'use strict';

/* global jQuery: false */

var app = angular.module('atadosApp');

app.controller('QuadrasCoralCtrl', function ($scope, $http, api) {
  $scope.site.title = 'Atados - Como engajar voluntários';
  $scope.test = 'testando';
  $scope.test2 = '';

  $scope.getProjects = function() {
    $http.get(api + 'projects/?coral=true').success(function(response) {
      $scope.projects = response.results;
    });
  }
  $scope.getProjects();
});