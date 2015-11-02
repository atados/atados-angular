'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('RootCtrl', function ($scope, $rootScope, $state, $location, Auth, loggedUser, NONPROFIT, storage, Search, saoPaulo, Site) {

  $scope.loggedUser = loggedUser;

  if (window.location.hash === '#session-expired') {
    toastr.error('Oops! Parece que sua sessão expirou! Você precisa logar novamente');
    $state.transitionTo('root.home');
  }

  Search.filter(null, null, null, saoPaulo.id);
  for (var c in Site.cities()) {
    if (Site.cities()[c].id === saoPaulo.id) {
      Search.city = Site.cities()[c];
    }
  }

  if ($rootScope.modalInstance) {
    $rootScope.modalInstance.close();
  }

  if ($scope.loggedUser && $scope.loggedUser.role === NONPROFIT) {
    $scope.loggedUser.address = $scope.loggedUser.user.address;
    $scope.loggedUser.causes.forEach(function (c) {
      c.image = storage + 'cause_' + c.id + '.png';
    });
    $scope.loggedUser.projects.forEach(function (p) {
      p.causes.forEach(function (c) {
        c.image = storage + 'cause_' + c.id + '.png';
      });
    });
  }

  $rootScope.$on('userLoggedIn', function(event, user, message) {
    if (user) {
      $scope.loggedUser = user;
      if (message) {
        toastr.success(message, $scope.loggedUser.slug);
      } else {
        toastr.success('Oi! Bom te ver por aqui :)', $scope.loggedUser.slug);
      }
      if ($rootScope.modalInstance) {
        $rootScope.modalInstance.close();
      }
      if (user.role === 'NONPROFIT') {
        $location.path('/controle/' + user.slug);
      }
    }
  });

  $rootScope.explorerView = false;

  $scope.logout = function () {
    toastr.success('Tchau até a próxima :)', $scope.loggedUser.slug);
    $scope.$emit('userLoggedOut');
    Auth.logout();
    $scope.loggedUser = null;
    $state.transitionTo('root.home');
  };

  $rootScope.toggleHeader = function() {
    if ($('#we-love-you').is(':visible')) {
      $('#we-love-you').slideUp();
    } else {
      $('#we-love-you').slideDown();
    }
  };
});
