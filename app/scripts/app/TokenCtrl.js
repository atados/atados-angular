import {api} from '../constants';

// controller
function TokenCtrl ($scope, $http, $location, $state, toastr) {
  'ngInject';
  $scope.site.title = 'Atados - Juntando Gente Boa';

  var token = $location.search().token;

  if (token) {
    $http.put(api + 'confirm_email/', {'token': token}).success(function (response) {
      $state.transitionTo('root.explore');
      toastr.success('Email confirmado com successo!', response.data);
    }).error(function () {
      toastr.error('Não conseguimos confirmar seu email. Entre em contato conosco para resolver seu problema.');
    });
  }
};

export default TokenCtrl;
