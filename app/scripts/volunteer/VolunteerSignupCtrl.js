'use strict';

/* global toastr: false */
/* global dataLayer: false */

var app = angular.module('atadosApp');

app.controller('VolunteerSignupCtrl', function($scope, $rootScope, $state, Auth, Restangular) {
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

  $scope.$watch('slug', function (value) {
    if (value) {
      if (value.indexOf(' ') >= 0) {
        $scope.signupForm.slug.$invalid = true;
        $scope.signupForm.slug.hasSpace = true;
        $scope.signupForm.slug.alreadyUsed = false;
      } else if (value.indexOf('.') >= 0) {
        $scope.signupForm.slug.$invalid = true;
        $scope.signupForm.slug.hasDot = true;
        $scope.signupForm.slug.alreadyUsed = false;
      } else {
        $scope.signupForm.slug.hasSpace = false;
        $scope.signupForm.slug.hasDot = false;
        $scope.signupForm.slug.$invalid = false;
        Auth.isSlugUsed(value, function (response) {
          $scope.signupForm.slug.alreadyUsed = response.alreadyUsed;
          $scope.signupForm.slug.$invalid = response.alreadyUsed;
        });
      }
    } else {
      $scope.signupForm.slug.alreadyUsed = false;
      $scope.signupForm.slug.hasSpace = false;
      $scope.signupForm.slug.hasDot = false;
      $scope.signupForm.slug.$invalid = false;
    }
  });

  $scope.$watch('email', function (value) {
    if (value) {
      Auth.isEmailUsed(value, function (response) {
        $scope.signupForm.email.alreadyUsed = response.alreadyUsed;
        $scope.signupForm.email.$invalid = response.alreadyUsed;
      });
    } else {
      $scope.signupForm.email.alreadyUsed = false;
    }
  });

  $scope.$watch('password + passwordConfirm', function() {
    $scope.passwordDoesNotMatch = $scope.password !== $scope.passwordConfirm;
  });

  $scope.signup = function () {
    dataLayer.push({
      'event': 'criarConta',
      'eventCategory': 'buttonClicked',
      'eventAction' : 'success'
    });

    if ($scope.signupForm.$valid) {
      console.log($state.current.name);
      var data = {
        slug: $scope.slug,
        email: $scope.email,
        password: $scope.password,
        address: {'city': $scope.city.id},
      };
      if ($state.current.name.split('.')[0] === 'gdd') {
        data.gdd = true;
      }
      Auth.volunteerSignup(data,
        function () {
          Auth.login({
            username: $scope.email,
            password: $scope.password,
            remember: $scope.remember
          }, function (response) {
            Auth.getCurrentUser(response.access_token).then(
              function (user) {
                $rootScope.$emit('userLoggedIn', user);
              }, function (error) {
                toastr.error(error);
              });
          }, function () {
            $scope.error = 'Usuário ou senha estão errados :(';
          });
        },
        function (error) {
          console.error(error);
          toastr.error('Não conseguimos criar sua conta agora. :(');
        });
    }
  };
});
