import angular from 'angular'

var app = angular.module('atadosApp');

app.factory('Question', function($http, $state, Restangular, Cleanup, api) {
  return {
    getAll: function() {
      return $http.get(api + 'questions/');
    }
  };
});
