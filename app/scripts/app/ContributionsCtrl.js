'use strict';

/* global PagarMe */
/* global $: false */
/* global toastr: true */

var app = angular.module('atadosApp');

app.controller('ContributionsCtrl', ['$scope', '$stateParams', '$http', 'api',  function($scope, $stateParams, $http, api) {
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';

  $scope.contribution_price = $stateParams.value;
  $scope.optionsstyle = {'display': 'none'};

  $scope.name = 'Leonardo Arroyo';
  $scope.email = 'arroyo@leonardoarroyo.com';
  $scope.confirm_email = 'arroyo@leonardoarroyo.com';
  $scope.doc = '429.595.458-69';
  $scope.phone = '(11) 94764-4662';

  $scope.address_street = 'Av. Melchert';
  $scope.address_zip = '03065-030';
  $scope.address_number = '79';
  $scope.address_complement = 'Ap 93';
  $scope.address_city = 'São Paulo';
  $scope.address_state = 'SP';

  $scope.card_holder_name = 'Leonardo Araujo Arroyo';
  $scope.card_number = '4111111111111111';
  $scope.card_cvv = '123';
  $scope.card_expires = '09/2016';

  $scope.updatePrice = function (price) {
    $scope.contribution_price = price;
    $scope.toggleOptions();
  };

  $scope.toggleOptions = function () {
    if ($scope.optionsstyle) {
      $scope.optionsstyle = undefined;
    } else {
      $scope.optionsstyle = {'display': 'none'};
    }
  };



  $scope.submit = function() {
    PagarMe.encryption_key = 'ek_test_Bv1RBLDTKUFlQf5TJa9689W9vZlW51';
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

      'address_street': $scope.address_stree,
      'address_zip': $scope.address_zip,
      'address_number': $scope.address_number,
      'address_complement': $scope.address_complement,
      'address_city': $scope.address_city,
      'address_state': $scope.address_state,

      'card_holder_name': $scope.card_holder_name,
      'card_exp_month': exp_month,
      'card_exp_year': exp_year,
      'card_cvv': $scope.card_cvv,

      'recurrent': true,
      'value': $scope.contribution_price,
    };

    if(!hasErrors) {
      creditCard.generateHash(function(cardHash) {
        data.card_hash = cardHash;
        $http.post(api + 'contribute/', data).success(function(response) {
          if (response.success) {
            $('.contribute-container').hide();
            $('.thank-you-container').show();
          } else {
            toastr.error('Houve um erro! Por favor, confira os dados e tente novamente!');
            $('#cardform input, #cardform button').removeAttr('disabled');
          }
        }).error(function() {
          toastr.error('Houve um erro! Por favor, confira os dados e tente novamente!');
          $('#cardform input, #cardform button').removeAttr('disabled');
        });
      });
    }
  };
}]);
