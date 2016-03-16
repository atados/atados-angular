function emailSignupInput (Auth) {
  'ngInject';
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
};

export default emailSignupInput;
