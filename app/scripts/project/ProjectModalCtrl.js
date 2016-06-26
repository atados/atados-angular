'use strict';

var app = angular.module('atadosApp');

app.controller('ProjectModalCtrl', function ($rootScope, $scope, $window,  $modalInstance, $modal, nonprofit, phone, name, projectName) {
  $scope.nonprofit = nonprofit;
  $scope.projectName = projectName;
  $scope.contractForm = {
    email: '',
    phone: phone,
    name: name,
    message: '',
    phoneWarningMessage: ''
  };

  $scope.openTermsModal = function() {
    $rootScope.modalInstance = $modal.open({
      templateUrl: '/partials/volunteerTermsModal.html'
    });
  };

  $scope.ok = function () {
    if (!$scope.contractForm.phone || !$scope.contractForm.phone || !$scope.contractForm.email) {
      $window.alert('Preencha seu nome, telefone e email para participar desta vaga');
    } else {
      $modalInstance.close({phone: $scope.contractForm.phone, name: $scope.contractForm.name, email: $scope.contractForm.email});
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
