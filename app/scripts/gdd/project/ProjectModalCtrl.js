// controller
function ProjectModalCtrl ($scope, $modalInstance, nonprofit, phone, name) {
  'ngInject';
  $scope.nonprofit = nonprofit;
  $scope.contractForm = {};
  $scope.contractForm.phone = phone;
  $scope.contractForm.name = name;
  $scope.contractForm.message = '';
  $scope.phoneWarningMessage = '';

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
