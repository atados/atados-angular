'use strict';

/* global $: false */
/* global toastr: false */

var app = angular.module('atadosApp');

app.directive('removerole', function() {
  return {
    restrict: 'E',
    template: '<button type="destroy" ng-click="removeRole(role, "work")"><i class="fa fa-trash-o"></i></button>'
  };
});

app.directive('button', function() {
  return {
    restrict: 'E',
    compile: function(element, attrs) {
      if ( attrs.type === 'submit') {
        element.addClass('btn-primary');
      } else if ( attrs.type === 'destroy' ) {
        element.addClass('destroy');
      } else if ( attrs.type ) {
        element.addClass('btn-' + attrs.type);
      }
      if ( attrs.size ) {
        element.addClass('btn-' + attrs.size);
      }
    }
  };
});

app.directive('button-facebook', function() {
  return {
    restrict: 'E'
  };
});

app.directive('projectCard', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/projectCard.html'
  };
});

app.directive('depoimento', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/depoimento.html'
  };
});

app.directive('atadosSearch', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/search.html',
    controller: 'SearchCtrl'
  };
});

app.directive('nonprofitCard', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/partials/nonprofitCard.html'
  };
});

app.directive('projectForm', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/projectForm.html',
    controller: 'ProjectFormCtrl'
  };
});

app.directive('nonprofitForm', function() {
  return {
    restrict: 'E',
    scope: true,
    link: function(scope) {
      scope.$parent.nonprofitValidation = scope.validation;
      scope.$parent.saveNonprofit = scope.saveNonprofit;
      scope.setStep = scope.$parent.setFormStep;
      scope.setShowRegistration = scope.$parent.setShowRegistration;
    },
    templateUrl: '/partials/nonprofitForm.html',
    controller: 'NonprofitFormCtrl'
  };
});

app.directive('phone', function () {
  return {
    restrict: 'E',
    scope: {
      number: '@'
    },
    template: '<p><i class="fa fa-phone"></i> {{number}}</p>'

  };
});

app.directive('emailSignupInput', function (Auth) {
  return {
    restrict: 'E',
    scope: {
      object: '=object',
      form: '=form',
    },
    templateUrl: '/partials/emailSignupInput.html',
    link: function(scope) {
      function twoAreEqual(email, confirm) {
        if ((email && confirm) && email !== confirm) {
          scope.form.confirmEmail.notEqual = true;
          scope.form.$invalid = true;
        } else {
          scope.form.confirmEmail.notEqual = false;
          if (confirm) {
            scope.form.$invalid = false;
          }
        }
      }
      scope.$watch('object.email', function (value, oldValue) {
        if (value !== oldValue) {
          Auth.isEmailUsed(value, function (response) {
            scope.form.email.alreadyUsed = response.alreadyUsed;
            scope.form.email.$invalid = response.alreadyUsed;
            if (!scope.form.email.alreadyUsed) {
              twoAreEqual(scope.object.email, scope.confirmEmail);
            }
          });
        }
      });
      scope.$watch('confirmEmail', function (value, oldValue) {
        if (value && value !== oldValue) {
          twoAreEqual(scope.object.email, scope.confirmEmail);
        }
      });
    },
  };
});

app.directive('phoneInput', function () {
  return {
    restrict: 'E',
    scope: {
      object: '=object',
      form: '=form',
    },
    templateUrl: '/partials/phoneInput.html',
    link: function() {
      $('#phoneInput').focus(
        function(){
          $(this).mask('(99) 9999-9999?9', {
            completed:function(){
              $(this).mask('(99) 99999-9999');
            }
          });
        });
    },
  };
});

app.directive('nonprofitPhoneInput', function () {
  return {
    restrict: 'E',
    scope: {
      object: '=object',
      form: '=form',
    },
    templateUrl: '/partials/nonprofitPhoneInput.html',
    link: function($scope, element) {
      element.find('input').focus(
        function(){
          $(this).mask('(99) 9999-9999?9', {
            completed:function(){
              $(this).mask('(99) 99999-9999');
            }
          });
        });
    },
  };
});

app.directive('projectPhoneInput', function () {
  return {
    restrict: 'E',
    scope: {
      object: '=object',
      form: '=form',
    },
    templateUrl: '/partials/projectPhoneInput.html',
    link: function($scope, element) {
      element.find('input').focus(
        function(){
          $(this).mask('(99) 9999-9999?9', {
            completed:function(){
              $(this).mask('(99) 99999-9999');
            }
          });
        });
    },
  };
});

app.directive('zipcodeInput', function () {
  return {
    restrict: 'E',
    scope: {
      object: '=object',
      form: '=form',
    },
    templateUrl: '/partials/zipcodeInput.html',
    link: function() {
      $('#zipcodeInput').mask('99999-999');
    },
  };
});

app.directive('causes', function () {
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
});

app.directive('skills', function () {
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
});


app.directive('email', function () {
  return {
    restrict: 'E',
    scope: {
      email: '@'
    },
    template: '<p><i class="fa fa-laptop"></i> {{email}}</p>'
  };
});

app.directive('contactatados', function() {
  return {
    restrict: 'E',
    scope: {},
    template: '<p>Entre em contato clicando abaixo no canto direito se estiver tendo problemas.</p>'
  };
});

app.directive('doubtAtados', function() {
  return {
    restrict: 'E',
    scope: {},
    template: '<p>Entre em contato clicando abaixo no canto direito se estiver com dúvidas.</p>'
  };
});

app.directive('backgroundImg', function () {
  return function (scope, element, attrs) {
    var url = attrs.backgroundImg;
    element.css({
      'background-image': 'url(' + url + ')',
      'background-size': 'cover'
    });
  };
});

app.directive('imgCropped', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { src:'@', selected:'&' },
    link: function(scope,element/*, attr */) {
      var myImg;
      var clear = function() {
        if (myImg) {
          myImg.next().remove();
          myImg.remove();
          myImg = undefined;
        }
      };
      scope.$watch('src', function(nv) {
        clear();
        if (nv) {
          element.after('<img />');
          myImg = element.next();
          myImg.attr('src',nv);
          $(myImg).Jcrop({
            trackDocument: true,
            onSelect: function(x) {
              scope.$apply(function() {
                scope.selected({cords: x});
              });
            }
          });
        }
      });
      
      scope.$on('$destroy', clear);
    }
  };
});

app.directive('cardExpiration', function() {
  return {
    link: function($scope, element) {
      element.mask('99/9999');
    } 
  };
});

app.directive('inputShowLength', function() {
  return {
    link: function($scope, element, attrs) {
      var fieldCounterWrapper = element.parent().append('<span class="input-field-counter"><span class="count">0</span>/<span>'+attrs.ngMaxlength+'</span></span>');
      var count = fieldCounterWrapper.find('.count');
      var updateCount = function(e) {
          count.html(e.target.value.length);
      };

      element
        .addClass('input-field-counter-padding')
        .keyup (function(e) { updateCount(e); })
        .change(function(e) { updateCount(e); });
    }
  };
});

app.directive('lockMaxlength', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      var maxlength = Number(attrs.lockMaxlength);
      function fromUser(text) {
        if (text.length > maxlength) {
          var transformedInput = text.substring(0, maxlength);
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
          return transformedInput;
        } 
        return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});
