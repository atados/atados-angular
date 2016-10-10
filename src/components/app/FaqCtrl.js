import angular from 'angular'

/* global jQuery: false */

var app = angular.module('atadosApp');

app.controller('FaqCtrl', function ($scope, questions) {
  $scope.site.title = 'Atados - Perguntas Frequentes';
  $scope.questions = questions.data.results;

  $scope.togglePanel = function(e) {
    jQuery(e.target)
      .closest('.panel')
      .find('.panel-collapse')
      .toggleClass('collapse');
  };
});
