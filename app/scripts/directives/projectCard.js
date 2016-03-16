function projectCard () {
  'ngInject';
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/projectCard.html'
  };
};

export default projectCard;
