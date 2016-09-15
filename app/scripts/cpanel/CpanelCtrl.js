'use strict';

var app = angular.module('atadosApp');

app.controller('CpanelCtrl', function ($scope) {
  $scope.site.title = 'Atados - Control Panel';

  $scope.cpanel = {}

  $scope.cpanel.notifications = [
    {
      type: 'alert',
      text: 'Você possui 2 vagas pendentes para atualização!',
      url: '/painel/vaga/1'
    }
  ];

});


