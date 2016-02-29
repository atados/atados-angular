'use strict';

var app = angular.module('atadosApp');

app.controller('FaqCtrl', function ($scope, questions) {
  $scope.site.title = 'Atados - Perguntas Frequentes';
  $scope.questions = questions.data.results;

  $scope.togglePanel = function(e) {
    console.log(jQuery(e.target).closest('.panel').find('.panel-collapse').toggleClass('collapse'));
  }
});
