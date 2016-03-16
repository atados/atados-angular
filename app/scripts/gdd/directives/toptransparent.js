// directive
function toptransparent ($window) {
  'ngInject';
  return function(scope, element) {
    angular.element($window).bind('scroll', function() {
      if (this.pageYOffset >= 100) {
        angular.element(element).removeClass('top-transparent');
      } else {
        angular.element(element).addClass('top-transparent');
      }
    scope.$apply();
    });
  };
};

export default toptransparent;
