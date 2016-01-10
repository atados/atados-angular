'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('ContactCtrl', function ($scope, $http, api) {
  $scope.site.title = 'Atados - Contato';
  $scope.sent = false;
  $scope.recipients = [
    {
      'name': 'Departamento de TI',
      'email': 'arroyo@atados.com.br'
    },
    {
      'name': 'Financeiro',
      'email': 'davi@atados.com.br'
    }
  ];
  $scope.form = {
    name: '',
    email: '',
    message: '',
  };

  $scope.submit = function(e) {
    e.preventDefault();
    if ($scope.contactForm.$valid) {
      $http.post(api + 'contact/', $scope.form)
        .success(function() {
          $scope.sent = true;
        })
        .error(function() {
          toastr.error('Oops! Parece que houve algum erro em nosso servidor. Tente novamente mais tarde');
        });
    } else {
      toastr.error('Oops! Parece que você esqueceu de preencher algum campo.');
    }
  };
});
