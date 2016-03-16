function causes (toastr) {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      selected: '=',
      all: '='
    },
    templateUrl: '/partials/causeInput.html',
    link: function(scope) {
      if (!scope.selected) {
        scope.selected = [];
      }
      scope.inSelected = function(cause) {
        if (scope.selected.length === 0) {
          scope.causeChosen = scope.$parent.causeChosen = false;
        } else {
          scope.causeChosen = scope.$parent.causeChosen = true;
        }
        return scope.selected.indexOf(cause) !== -1 || scope.selected.indexOf(cause.id) !== -1;
      };

      scope.addCause = function(cause) {
        var index = scope.selected.indexOf(cause);
        if (index !== -1) {
          scope.selected.splice(index, 1);
        } else {
          if (scope.selected.length < 3) {
            scope.selected.push(cause);
          }
          else {
            toastr.error('Você pode selecionar até 3 causas.');
          }
        }
      };
    }
  };
};

export default causes;
