'use strict';

/* global jQuery: false */

var app = angular.module('atadosApp');

app.controller('LandingCompanyPageCtrl', function ($scope, $http, api) {
  $scope.site.title = 'Atados - Como engajar voluntários';
  $scope.created = false;
  $scope.form = {}

  $scope.sendForm = function() {
  	$http.post(api + 'landing-company/', {email: $scope.form.email, organization: $scope.form.ong, city: $scope.form.city, employee_number: $scope.form.employee_number}).success( function(response) {
  		$scope.created = response.created;
    });
  }
});