function phoneInput () {
  'ngInject';
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
};

export default phoneInput;
