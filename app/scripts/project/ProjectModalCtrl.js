// controller
function ProjectModalCtrl ($rootScope, $scope, $modalInstance, $modal, nonprofit, phone, name, projectName) {
  'ngInject';
  $scope.nonprofit = nonprofit;
  $scope.projectName = projectName;
  $scope.contractForm = {
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
    if (!$scope.contractForm.phone && !$scope.phoneWarningMessage) {
      $scope.phoneWarningMessage = 'Não é obrigátorio colocar seu telefone e nome. Mas vai ajudar muito a ONG a entrar em contato com você rapidamente. Se você quer continuar sem telefone click em Ok e você vai ser cadastrado';
    } else {
      $modalInstance.close({phone: $scope.contractForm.phone, name: $scope.contractForm.name, message: $scope.contractForm.message});
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

export default ProjectModalCtrl;
