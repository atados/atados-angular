'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('GddIdeasCtrl', function($rootScope, $scope, $sce, $modal, $http, Restangular, api, $location) {
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3.amazonaws.com/atados-us/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';
});
