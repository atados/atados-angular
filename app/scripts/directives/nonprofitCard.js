function nonprofitCard () {
  'ngInject';
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/nonprofitCard.html'
  };
};

export default nonprofitCard;
