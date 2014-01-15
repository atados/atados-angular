'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('NonprofitSignupCtrl', function($scope, $filter, $state, Auth, Photos, Restangular) {

  $scope.nonprofit = {
    address: {
      neighborhood:null,
      zipcode:null,
      addressline:null,
      addressnumber:null,
    },
    phone:null,
    description:null,
    name:null,
    slug:null,
    details:null,
    user:{
      first_name:null,
      slug:null,
      last_name:null,
      email:null,
      password:null
    },
    facebook_page:null,
    google_page:null,
    twitter_handle:null,
    website:null,
    causes:[]
  };

  // Checking that email is valid and not already used.
  $scope.$watch('nonprofit.user.email', function (value) {
    Auth.isEmailUsed(value, function () {
      $scope.signupForm.email.alreadyUsed = false;
      $scope.signupForm.email.$invalid = false;
    }, function () {
      $scope.signupForm.email.alreadyUsed = true;
      $scope.signupForm.email.$invalid = true;
    });
  });

  $scope.$watch('nonprofit.user.slug', function (value) {
    // Checking that slug not already used.
    if (value) {
      if (value.indexOf(' ') >= 0) {
        $scope.signupForm.slug.$invalid = true;
        $scope.signupForm.slug.hasSpace = true;
      } else {
        $scope.signupForm.slug.$invalid = false;
        $scope.signupForm.slug.hasSpace = false;
        Auth.isSlugUsed(value, function () {
          $scope.signupForm.slug.alreadyUsed = false;
          $scope.signupForm.slug.$invalid = false;
        }, function () {
          $scope.signupForm.slug.alreadyUsed = true;
          $scope.signupForm.slug.$invalid = true;
        });
      }
    } else {
      $scope.signupForm.slug.alreadyUsed = false;
      $scope.signupForm.slug.hasSpace = false;
      $scope.signupForm.slug.$invalid = false;
    }
  });

  $scope.cityLoaded = false;
  $scope.$watch('nonprofit.address.state', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];
    if (value && !value.citiesLoaded) {
      Restangular.all('cities').getList({page_size: 3000, state: value.id}).then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
          if (!c.active) {
            $scope.cities().push(c);
          }
        });
        value.citiesLoaded = true;
        $scope.cityLoaded = true;
      });
    } else if(value){
      var cities = $scope.cities();
      cities.forEach(function (c) {
        if (c.state.id === $scope.nonprofit.address.state.id) {
          $scope.stateCities.push(c);
        }
      });
      $scope.cityLoaded = true;
    }
  });

  $scope.$watch('password + passwordConfirm', function() {
    $scope.signupForm.password.doesNotMatch = $scope.password !== $scope.passwordConfirm;
    $scope.signupForm.password.$invalid = $scope.signupForm.password.doesNotMatch;
  });

  $scope.addCause = function(cause) {
    cause.checked = !cause.checked;
    if (cause.checked) {
      $scope.nonprofit.causes.push(cause);
    } else {
      var index = $scope.nonprofit.causes.indexOf(cause);
      if (index > -1) {
        $scope.nonprofit.causes.splice(index, 1);
      }
    }
  };

  $scope.uploadFile = function(files) {
    if (files) {
      var fd = new FormData();
      fd.append('file', files[0]);
      Photos.setVolunteerPhoto(fd, function(response) {
        $scope.image = response.file;
      }, function() {
        toastr.error('Error no servidor. Não consigo atualizar sua foto :(');
      });
    }
  };

  $scope.signup = function () {
    $scope.nonprofit.user.password = $scope.password;
    $scope.facebook_page = 'http://facebook.com/' + $scope.facebook_page;
    Auth.nonprofitSignup($scope.nonprofit, function () {
      toastr.success('Bem vinda ONG ao atados!');
      $state.transitionTo('root.nonprofitadmin');
    },
    function (error) {
      toastr.error(error);
    });
  };
});


