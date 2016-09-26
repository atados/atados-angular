'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('HomeCtrl', function($rootScope, $scope, $sce, $modal, $http, Restangular, api, $location, $document) {
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';

  $scope.search.skill = '';
  $scope.search.cause = '';



  // News
  $scope.news = {
    name:  '',
    email: '',
    state: '',
    city: '',
  };

  $scope.add_to_news = function() {
    $http.post(api + 'add_to_newsletter/', $scope.news).success(function(response) {
      toastr.success(response.msg);

      if (window.exitIntent.isOpen) {
        window.exitIntent.close()
      }

      $scope.news = {
        name: '',
        email: '',
        state: '',
        city: ''
      };
    }).error(function() {
      toastr.error('Um erro ocorreu.');
    });
  };


  $scope.open_video = function (url) {
    $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'modalVideo.html',
      controller: 'modalVideo',
      size: 'lg',
      resolve: {
        url: function() {
          return url;
        }
      }
    });
  };


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

  $scope.see_projects = function() {
    $document.scrollToElement(angular.element('#atados-explorer'), 0, 500)
    .then(function () {
      $location.hash('atados-explorer');
    });
  };

  $scope.htmlReady();

});

app.controller('modalVideo', function ($scope, $modalInstance, url) {
  $scope.url = 'https://www.youtube.com/embed/' + url + '?autoplay=1'; // jshint ignore:line
  $scope.close_video = function () {
    $modalInstance.close();
  };
});
