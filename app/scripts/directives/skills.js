function skills (toastr) {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      selected: '=',
      all: '='
    },
    templateUrl: '/partials/skillInput.html',
    link: function(scope) {
      if (!scope.selected) {
        scope.selected = [];
      }
      scope.inSelected = function(skill) {
        if (scope.selected.length === 0) {
          scope.skillChosen = scope.$parent.skillChosen = false;
        } else {
          scope.skillChosen = scope.$parent.skillChosen = true;
        }
        return scope.selected.indexOf(skill) !== -1 || scope.selected.indexOf(skill.id) !== -1;
      };

      scope.addSkill = function(skill) {
        var index = scope.selected.indexOf(skill);
        if (index !== -1) {
          scope.selected.splice(index, 1);
        } else {
          if (scope.selected.length < 3) {
            scope.selected.push(skill);
          }
          else {
            toastr.error('Você pode selecionar até 3 habilidades.');
          }
        }
      };
    }
  };
};

export default skills;
