'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('GddExploreCtrl', function($rootScope, $scope, $sce, $modal, $http, Restangular, api, $location, $anchorScroll) {
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';
  $scope.gdd = true;
});
