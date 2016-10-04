'use strict';

/* global toastr: false */
/* global $: false */

var app = angular.module('atadosApp');

app.controller('RootCtrl', function ($scope, $rootScope, $modal, $state, $location, $timeout, Cookies,  Auth, loggedUser, NONPROFIT, storage, Search) {

  $scope.loggedUser = loggedUser;

  $scope.searchIP = function() {
      var url = 'https://geoip.atados.com.br/';
      var state = $state.current;
      $.get(url, function(data) {
        $rootScope.geoIP = data;

        // Preset city on home
        var long_name;
        if (data.region_code === 'DF') {
          long_name = 'Distrito Federal';
        } else if (data.region_code === 'PR') {
          long_name = 'Paraná';
        } else if (data.region_code === 'RJ') {
          long_name = 'Rio de Janeiro';
          $scope.isRio = true;
        } else {
          long_name = 'São Paulo';
        }
        var address = {
          address_components: [{'long_name':long_name,'types':['administrative_area_level_1','political']}],
        };

        if (state.name!=='root.grandeSP') {
          Search.filter(null, null, null, address);
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
      if (c !== undefined) {
        c.image = storage + 'cause_' + c.id + '.png';
      }
    });
    $scope.loggedUser.projects.forEach(function (p) {
      p.causes.forEach(function (c) {
        if (c !== undefined) {
          c.image = storage + 'cause_' + c.id + '.png';
        }
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

  // if ($scope.loggedUser && !$scope.loggedUser.address) {
  //   $rootScope.askForAddress($scope.loggedUser);
  // }

  $rootScope.$on('userLoggedIn', function(event, user, message, callback) {
    if (user) {
      $scope.loggedUser = user;
      if (!callback) {
        if (message) {
          toastr.success(message, $scope.loggedUser.slug);
        } else {
          toastr.success('Oi! Bom te ver por aqui :)', $scope.loggedUser.slug);
        }
        if ($rootScope.modalInstance) {
          $rootScope.modalInstance.close();
        }
        if (user.role === 'NONPROFIT') {
          if ($state.current.name !== 'root.newproject') {
            $location.path('/controle/' + user.slug);
          }
        }
      } else {
        callback();
      }
      // if (!user.address) {
      //   $rootScope.askForAddress(user);
      // }
    }
  });
});
