// controller
function VolunteerModalCtrl ($scope) {
  'ngInject';
  $scope.loginActive = true;
  $scope.$watch('loginActive', function (value) {
    if (value) {
      $scope.facebookState = 'Entrar ';
    } else {
      $scope.facebookState = 'Criar conta ';
    }
  });

  $scope.switchLoginActive = function () {
    $scope.loginActive = !$scope.loginActive;
  };
};

export default VolunteerModalCtrl;
