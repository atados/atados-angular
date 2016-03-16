// controller
function GddIdeasCtrl ($rootScope, $scope, $sce, $modal, $http, Restangular, api, $location) {
  'ngInject';
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';
};

export default GddIdeasCtrl;
