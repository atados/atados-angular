'use strict';

/* global toastr: false */
/* global $: false */

var app = angular.module('atadosApp');

app.controller('RootCtrl', function ($scope, $rootScope, $modal, $state, $location, $timeout, Cookies,  Auth, loggedUser, NONPROFIT, storage, Search, saoPaulo, curitiba, brasilia, rioDeJaneiro, Site) {

  $scope.loggedUser = loggedUser;

  $scope.searchIP = function() {
      var url = 'https://geoip.atados.com.br/';
      $.get(url, function(data) {
        $rootScope.geoIP = data;

        // Preset city on home
        var city;
        if (data.region_code === 'DF') {
          city = brasilia;
        } else if (data.region_code === 'PR') {
          city = curitiba;
        } else if (data.region_code === 'RJ') {
          city = rioDeJaneiro;
          $scope.isRio = true;
        } else {
          city = saoPaulo;
        }

        Search.filter(null, null, null, city.id);
        for (var c in Site.cities()) {
          if (Site.cities()[c].id === city.id) {
            Search.city = Site.cities()[c];
          }
        }
      });
  };
  $scope.searchIP();

  if (window.location.hash === '#session-expired') {
    toastr.error('Oops! Parece que sua sessão expirou! Você precisa logar novamente');
    $state.transitionTo('root.home');
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

  $rootScope.explorerView = false;

  $scope.logout = function () {
    toastr.success('Tchau até a próxima :)', $scope.loggedUser.slug);
    $scope.$emit('userLoggedOut');
    Auth.logout();
    $scope.loggedUser = null;
    $state.transitionTo('root.home');
  };

  $rootScope.askForAddress = function(user) {
    $rootScope.addressModal = $modal.open({
      backdrop: 'static',
      keyboard: false,
      templateUrl: '/partials/addressModal.html',
      controller: ['$scope', 'Site', 'Restangular', 'Volunteer', '$rootScope', function ($scope, Site, Restangular, Volunteer, $rootScope) {
        $scope.states = Site.states;

        $scope.saveAddress = function() {
          if ($scope.city) {
            user.address = {city: $scope.city};
            Volunteer.save(user, function() {
              $rootScope.addressModal.close();
            }, function() {});
          } else {
            window.alert('Selecione sua cidade! :)');
          }
        };

        $scope.cityLoaded = false;
        $scope.$watch('state', function (value) {
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
      }]
    });
  };

  if ($scope.loggedUser && !$scope.loggedUser.address) {
    $rootScope.askForAddress($scope.loggedUser);
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
      if (!user.address) {
        $rootScope.askForAddress(user);
      }
    }
  });
});
