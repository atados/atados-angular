'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('GddExploreCtrl', function($rootScope, $scope, $sce, $modal, $http, Restangular, api, $location) {
  window.location = 'https://global.good-deeds-day.org/br';
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3.amazonaws.com/atados-us/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';
  $scope.gdd = true;


  $scope.selectMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .addClass('hover');
  };

  $scope.removeMarker = function (marker, object) {
    angular.element(document.querySelector('#card-' + object.slug))
      .removeClass('hover');
  };
});
