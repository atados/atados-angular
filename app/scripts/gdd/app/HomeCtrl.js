'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('GddHomeCtrl', function($rootScope, $scope, $sce, $modal, $http, Restangular, api, $location) {
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';

  $scope.search.skill = '';
  $scope.search.cause = '';
  $scope.isHome = true;


  $scope.cityLoaded = false;
  $scope.$watch('news.state', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];

    if (value) {
      Restangular.all('cities').getList({page_size: 3000, state: value.id}).then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
        });

        value.citiesLoaded = true;
        $scope.cityLoaded = true;
      });
    }
  });

  $scope.calculateRemainingDays = function() {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date();
    var secondDate = new Date(2017,3,2);

    $scope.remainingDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
  }

  $scope.calculateRemainingDays();

  $scope.htmlReady();

});
