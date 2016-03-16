// directive
function gddProjectCard () {
  'ngInject';
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/gdd/projectCard.html'
  };
};

export default gddProjectCard;
