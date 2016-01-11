'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('ContactCtrl', function ($scope, $http, api) {
  $scope.site.title = 'Atados - Contato';
  $scope.sent = false;
  $scope.recipients = [
    {
      'name': 'São Paulo',
      'email': 'contato@atados.com.br'
    },
    {
      'name': 'Rio de Janeiro',
      'email': 'rj@atados.com.br'
    },
    {
      'name': 'Brasília',
      'email': 'bsb@atados.com.br'
    },
    {
      'name': 'Outra cidade',
      'email': 'contato@atados.com.br;' // ; because contact api is built to split multiple emails and ng-options has trouble with two options using the same value
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
