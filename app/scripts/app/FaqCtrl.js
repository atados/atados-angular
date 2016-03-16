// controller
function FaqCtrl ($scope, questions) {
  'ngInject';
  $scope.site.title = 'Atados - Perguntas Frequentes';
  $scope.questions = questions.data.results;

  $scope.togglePanel = function(e) {
    jQuery(e.target)
      .closest('.panel')
      .find('.panel-collapse')
      .toggleClass('collapse');
  };
};

export default FaqCtrl;
