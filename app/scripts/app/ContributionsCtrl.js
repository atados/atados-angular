import {api} from '/constants';

// controller
function ContributionsCtrl ($scope, $stateParams, $http, toastr) {
  'ngInject';
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';
  $scope.$parent.hide_header = true;
  $scope.$parent.hide_footer = true;

  $scope.contribution_monthly = true;

  var value = String($stateParams.value).replace(/\D/g,'');
  if (String($stateParams.value).replace(/[^a-zA-Z-@]/g, '') === '@') {
    $scope.contribution_monthly = false;
  }

  $scope.contribution_price = value;
  $scope.optionsstyle = {'display': 'none'};

  $('.trustlogo').addClass('show-comodo');

  $scope.toggleOptions = function () {
    if ($scope.optionsstyle) {
      $scope.optionsstyle = undefined;
      $scope.pricestyle = {'display': 'none'};
    } else {
      if (!isNaN($scope.contribution_price)) {
        $scope.optionsstyle = {'display': 'none'};
        $scope.pricestyle = undefined;
      } else {
        window.alert('O valor inserido está incorreto.');
      }
    }
  };

  $scope.setRecurrent = function() {
    $scope.contribution_monthly = true;
  };
  $scope.unsetRecurrent = function() {
    $scope.contribution_monthly = false;
  };

  $scope.cardError = function() {
    toastr.error('Houve um erro! Por favor, confira os dados e tente novamente!');
    $('#cardform input, #cardform button').removeAttr('disabled');
    $('.btn-submit').html('Próximo passo...');
  };

  $scope.submit = function() {
    //PagarMe.encryption_key = 'ek_test_Bv1RBLDTKUFlQf5TJa9689W9vZlW51'; // dev
    PagarMe.encryption_key = 'ek_live_BLoNfHnapvkwXlUAOH5ek8fXOMndGv'; // live

    if ($scope.contribution_price < 30) {
      window.alert('O valor mínimo de doação é de R$30,00.');
      return;
    }

    $('#cardform input, #cardform button').attr('disabled', 'disabled');
    $('.btn-submit').html('Enviando...');

    var creditCard = new PagarMe.creditCard();

    var expiration = $scope.card_expires;
    var exp_month, exp_year;

    if (expiration) {
      var expiration_split = $scope.card_expires.split('/');
      exp_month = expiration_split[0];
      exp_year = expiration_split[1];
    }

    creditCard.cardHolderName = $scope.card_holder_name;
    creditCard.cardExpirationMonth = exp_month;
    creditCard.cardExpirationYear = exp_year;
    creditCard.cardNumber = $scope.card_number;
    creditCard.cardCVV = $scope.card_cvv;

    var fieldErrors = creditCard.fieldErrors();

    var hasErrors = false;
    $scope.card_holder_name_error = $scope.card_number_error = $scope.card_cvv_error =  $scope.card_expires_error = '';

    angular.forEach(fieldErrors, function(v, k) {
      $scope[k+'_error'] = v;
      hasErrors = true;
      if (k === 'card_expiration_month' || k === 'card_expiration_year') {
        $scope.card_expires_error = 'Data de expiração inválida.';
      }
    });

    var data = {
      'name': $scope.name,
      'email': $scope.email,
      'confirm_email': $scope.confirm_email,
      'doc': $scope.doc,
      'phone': $scope.phone,

      'address_street': $scope.address_street,
      'address_zip': $scope.address_zip,
      'address_number': $scope.address_number,
      'address_complement': $scope.address_complement,
      'address_city': $scope.address_city,
      'address_state': $scope.address_state,

      'card_holder_name': $scope.card_holder_name,
      'card_exp_month': exp_month,
      'card_exp_year': exp_year,
      'card_cvv': $scope.card_cvv,

      'recurrent': $scope.contribution_monthly,
      'value': parseFloat($scope.contribution_price),
    };

    if(!hasErrors) {
      creditCard.generateHash(function(cardHash) {
        data.card_hash = cardHash;
        $http.post(api + 'contribute/', data).success(function(response) {
          if (response.success) {
            $('.contribute-container').hide();
            $('.thank-you-container').show();
          } else {
            if (response.error === 'invalid_flag') {
              $('.contribute-container').hide();
              $('.invalid-flag-container').show();
            } else if (response.error === 'card_refused') {
              $('.contribute-container').hide();
              $('.card-refused-container').show();
            } else {
              $scope.cardError();
            }
          }
        }).error(function() {
            $scope.cardError();
        });
      });
    } else {
      $scope.cardError();
    }
  };

  if (!$scope.contribution_price) {
    $scope.contribution_price = 100;
    $scope.toggleOptions();
  }

  $scope.$on('$stateChangeStart', function () {
    $scope.$parent.hide_header = false;
    $scope.$parent.hide_footer = false;
    $('.trustlogo').removeClass('show-comodo');
  });
};

export default ContributionsCtrl;
