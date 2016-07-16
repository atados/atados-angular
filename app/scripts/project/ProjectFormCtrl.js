'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('ProjectFormCtrl', function ($scope, $state, $stateParams, $timeout, $filter, Restangular, Project) {
  $scope.project = {
    causes: [],
  }

  /*
   * Skills and causes
   */
  $scope.filteredCauses = $filter('filter')($scope.causes(), {name: '!Todas Causas'});
  $scope.filteredSkills = $filter('filter')($scope.skills(), {name: '!Todas Habilidades'});

  $scope.$watch('tmp_cause', function(value) {
    if (value) {
      if ($scope.project.causes.length < 3) {
        $scope.project.causes.push(value);
      }
    }
  });

  $scope.removeCause = function(id) {
    $scope.project.causes = $filter('filter')($scope.project.causes, {id: '!'+id});
  };

  /*
   * Dropzone
   */
  $scope.dzAddedFile = function( file  ) {
    //$log.log( file  );
  };

  $scope.dzError = function( file, errorMessage  ) {
    //$log.log(errorMessage);
  };

  $scope.dropzoneConfig = {
    parallelUploads: 3,
    maxFileSize: 30,
    dictDefaultMessage: 'lel' ,
  };


});
