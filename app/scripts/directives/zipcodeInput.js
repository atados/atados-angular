function zipcodeInput () {
  'ngInject';
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
};

export default zipcodeInput;
