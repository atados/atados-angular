import {VOLUNTEER, NONPROFIT} from '../constants';

// controller
function LegacyCtrl ($scope, $stateParams, $state, $http, Legacy, toastr) {
  'ngInject';
  if ($stateParams.nonprofitUid) {
    Legacy.nonprofit($stateParams.nonprofitUid, function (response) {
      var slug = response.slug;
      $state.transitionTo('root.nonprofit', {slug: slug});
    }, function () {
      $state.transitionTo('root.home');
      toastr.error('Essa ong não existe');
    });
  } else if ($stateParams.projectUid) {
    Legacy.project($stateParams.projectUid, function (response) {
      var slug = response.slug;
      $state.transitionTo('root.project', {slug: slug});
    }, function () {
      $state.transitionTo('root.home');
      toastr.error('Esta vaga não existe');
    });
  } else if ($stateParams.slug) {
    Legacy.users($stateParams.slug, function (response) {
      if (response.type === VOLUNTEER) {
        $state.transitionTo('root.volunteer', {slug: $stateParams.slug});
      } else if (response.type === NONPROFIT) {
        $state.go('root.nonprofit', {slug: $stateParams.slug});
      }
    }, function () {
      toastr.error('Não existe;');
    });
  }
};

toastr.options.closeButton = true;
toastr.options.hideEasing = 'linear';

export default LegacyCtrl;
