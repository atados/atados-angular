'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('NonprofitSignupCtrl', function($scope, $rootScope, $filter, $state, $http, api, Auth) {

  $scope.nonprofit = {
    image_url: 'https://s3.amazonaws.com/atados-us/project/default_project.jpg',
    cover_url: 'https://s3.amazonaws.com/atados-us/project/default_project.jpg',
    hidden_address: false,
    address: {
      addr:null,
      typed_address2:null,
    },
    phone:null,
    description:null,
    name:null,
    details:null,
    user:{
      name:null,
      slug:null,
      email:null,
      password:null
    },
    facebook_page:null,
    google_page:null,
    twitter_handle:null,
    website:null,
    causes:[]
  };

  $scope.$watch('nonprofit.address.addr', function (value) {
    if (value instanceof Object) {
      $scope.signupForm.address.$invalid = false;
    } else {
      $scope.signupForm.address.$invalid = true;
    }
  });

  $scope.buttonText = 'Finalizar cadastro';

  $scope.$watch('nonprofit.user.slug', function (value) {
    // Checking that slug not already used.
    if (value) {
      if (value.indexOf(' ') >= 0) {
        $scope.signupForm.slug.$invalid = true;
        $scope.signupForm.slug.hasSpace = true;
      } else {
        $scope.signupForm.slug.$invalid = false;
        $scope.signupForm.slug.hasSpace = false;
        Auth.isSlugUsed(value, function (response) {
          $scope.signupForm.slug.alreadyUsed = response.alreadyUsed;
          $scope.signupForm.slug.$invalid = response.alreadyUsed;
        });
      }
    } else {
      $scope.signupForm.slug.alreadyUsed = false;
      $scope.signupForm.slug.hasSpace = false;
      $scope.signupForm.slug.$invalid = false;
    }
  });

  $scope.$watch('nonprofit.name', function(value) {
    $http
      .get(api + 'generate_slug/' + value + '/')
      .success(function(data) {
        if (data && data.slug && data.slug !== 'null' && data.slug !== 'undefined') {
          $scope.nonprofit.user.slug = data.slug;
        }
      })
      .error(function() {
        $scope.nonprofit.user.slug = '';
      });
  });

  $scope.cityLoaded = false;

  $scope.$watch('password + passwordConfirm', function() {
    $scope.signupForm.password.doesNotMatch = $scope.password !== $scope.passwordConfirm;
    $scope.signupForm.password.$invalid = $scope.signupForm.password.doesNotMatch;
  });

  $scope.uploadImageFile = function(files) {
    if (files) {
      if (!$scope.files) {
        $scope.files = new FormData();
      }
      $scope.nonprofit.image_url = URL.createObjectURL(files[0]);
      $scope.files.append('image', files[0]);
      $scope.imageUploaded = true;
      $scope.$apply();
      return;
    }
    $scope.imageUploaded = false;
    $scope.$apply();
  };
  $scope.uploadCoverFile = function(files) {
    if (files) {
      if (!$scope.files) {
        $scope.files = new FormData();
      }
      $scope.nonprofit.cover_url = URL.createObjectURL(files[0]);
      $scope.files.append('cover', files[0]);
      $scope.coverUploaded = true;
      $scope.$apply();
      return;
    }
    $scope.coverUploaded = false;
    $scope.$apply();
  };

  $scope.signup = function () {
    if ($scope.signupForm.$valid && $scope.nonprofit.causes.length && $scope.imageUploaded && $scope.coverUploaded) {
      $scope.nonprofit.user.password = $scope.password;

      $scope.facebook_page = 'http://facebook.com/' + $scope.facebook_page;
      $scope.google_page = 'http://plus.google.com/' + $scope.google_page;
      $scope.twitter_handle = 'http://www.twitter.com/' + $scope.twitter_handle;

      $scope.files.append('nonprofit', angular.toJson($scope.nonprofit));

      $scope.creatingNonprofit = true;
      $scope.buttonText = 'Finalizando cadastro...';

      Auth.nonprofitSignup($scope.files, function () {
        Auth.login({
            username: $scope.nonprofit.user.email,
            password: $scope.nonprofit.user.password,
            remember: true
          }, function (response) {
            $scope.creatingNonprofit = false;
            $scope.buttonText = 'Finalizar cadastro';
            Auth.getCurrentUser(response.access_token).then(
              function (user) {
                $rootScope.$emit('userLoggedIn', user, 'Bem vinda ONG ao atados! Sua ONG ainda precisa ser aprovada. Espere pelo nosso email.');
                $state.transitionTo('root.nonprofitadmin');
              }, function (error) {
                console.error(error);
                toastr.error('Sua ONG foi criada mas não coseguimos te logar. Clique no botão acima "ONG" e use seu email e senha para logar.');
                $state.transitionTo('root.home');
              });
          }, function () {
            $scope.error = 'Usuário ou senha estão errados :(';
          });
      },
      function (error) {
        $scope.creatingNonprofit = false;
        $scope.buttonText = 'Finalizar cadastro';
        if (error.detail && error.detail === 'Nonprofit already exists.') {
          toastr.error('Esta ONG já está em nosso banco. Favor utilizar efetuar login ou entrar em contato.');
        }
      });
    } else {
      toastr.error('Ops! Parece que algum campo não foi preenchido corretamente.');
      $scope.show_errors = true;
    }
  };
});
