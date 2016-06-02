'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('VolunteerEditCtrl', function($scope, $filter, Auth, Photos, Volunteer, $http, Restangular, $state, Site, api, VOLUNTEER) {

  $scope.$watch('loggedUser', function (user) {
    if (!user) {
      toastr.error('Voluntário não logado para editar.');
      $state.transitionTo('root.home');
    }
  });

  $scope.$watch('volunteer.address.addr', function (value) {
    if (value instanceof Object) {
      $scope.volunteerEditForm.address.$invalid = false;
    } else {
      $scope.volunteerEditForm.address.$invalid = true;
    }
  });

  if ($scope.loggedUser && $scope.loggedUser.role === VOLUNTEER) {
    $scope.savedEmail = $scope.loggedUser.user.email;
    $scope.volunteer = $scope.loggedUser;
  } else {
    $state.transitionTo('root.home');
    toastr.error('Voluntário não logado para editar.');
  }

  $scope.uploadProfileFile = function(files) {
    if (files) {
      var fd = new FormData();
      fd.append('file', files[0]);
      Photos.setVolunteerPhoto(fd, function(response) {
        $scope.volunteer.image_url = response.file;
        toastr.success('Foto do voluntário salva com sucesso.');
      }, function() {
        toastr.error('Error no servidor. Não consigo atualizar sua foto :(');
      });
    }
  };

  $scope.getFacebookPhoto = function () {
    if ($scope.volunteer.facebook_uid) {
      Photos.getFacebookPhoto(function (response) {
        toastr.success('Foto do facebook salva com sucesso');
        $scope.volunteer.image_url = response;
      }, function () {
        toastr.error('Error no servidor. Não consigo pegar foto do Facebook.');
      });
    }
  };

  $scope.$watch('password + passwordConfirm', function() {
    $scope.volunteerEditForm.password.doesNotMatch = $scope.password !== $scope.passwordConfirm;
    $scope.volunteerEditForm.password.$invalid = $scope.volunteerEditForm.password.doesNotMatch;
  });

  $scope.saveVolunteer = function () {
    Volunteer.save($scope.volunteer, function() {
      toastr.success('Perfil salvo!', $scope.volunteer.slug);
      if ($scope.password && $scope.password === $scope.passwordConfirm) {
        Auth.changePassword({email: $scope.volunteer.user.email, password: $scope.password}, function () {
          toastr.success('Senha nova salva', $scope.volunteer.slug);
        }, function () {
          toastr.error('Não conseguimos atualizar sua senha :(');
            });
        }
    }, function () {
      toastr.error('Problema em salvar seu perfil :(');
    });

    
  };
});
