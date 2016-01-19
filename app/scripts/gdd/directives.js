'use strict';

var app = angular.module('atadosApp');

app.directive('gddSearch', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/gdd/search.html',
    controller: 'GddSearchCtrl'
  };
});

app.directive('gddProjectCard', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/gdd/projectCard.html'
  };
});

app.directive('toptransparent', function ($window) {
  return function(scope, element) {
    angular.element($window).bind('scroll', function() {
      if (this.pageYOffset >= 100) {
        angular.element(element).removeClass('top-transparent');
      } else {
        angular.element(element).addClass('top-transparent');
      }
    scope.$apply();
    });
  };
});
