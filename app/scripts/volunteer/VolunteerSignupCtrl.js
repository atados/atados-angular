'use strict';

/* global toastr: false */
/* global dataLayer: false */

var app = angular.module('atadosApp');

app.controller('VolunteerSignupCtrl', function($scope, $rootScope, $state, Auth) {
  $scope.cityLoaded = false;

  $scope.$watch('address.addr', function (value) {
    if (value instanceof Object) {
      $scope.signupForm.address.$invalid = false;
    } else {
      $scope.signupForm.address.$invalid = true;
    }
  });

  $scope.$watch('password + passwordConfirm', function() {
    $scope.passwordDoesNotMatch = $scope.password !== $scope.passwordConfirm;
  });

  $scope.signingUp = false;
  $scope.signup = function () {
    dataLayer.push({
      'event': 'criarConta',
      'eventCategory': 'buttonClicked',
      'eventAction' : 'success'
    });

    if ($scope.signupForm.$valid) {
      var data = {
        email: $scope.email,
        password: $scope.password,
        address: $scope.address,
      };
      if ($state.current.name.split('.')[0] === 'gdd') {
        data.gdd = true;
      }

      $scope.signingUp = true;
      Auth.volunteerSignup(data,
        function () {
          Auth.login({
            username: $scope.email,
            password: $scope.password,
            remember: $scope.remember
          }, function (response) {
            $scope.signingUp = false;

            Auth.getCurrentUser(response.access_token).then(
              function (user) {
                $rootScope.$emit('userLoggedIn', user);
              }, function (error) {
                toastr.error(error);
              }
            );
          }, function () {
            $scope.signingUp = false;
            $scope.error = 'Usuário ou senha estão errados :(';
          });
        },
        function (error) {
          $scope.signingUp = false;
          $scope.sendingSignup = false;
          toastr.error('Não conseguimos criar sua conta agora. :(');
        }
      );
    }
  };
});
