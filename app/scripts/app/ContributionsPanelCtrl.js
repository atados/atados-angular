'use strict';

/* global toastr: true */
/* global $: true */

var app = angular.module('atadosApp');

app.controller('ContributionsPanelCtrl', ['$scope', '$stateParams', '$http', 'api',  function($scope, $stateParams, $http, api) {
  $scope.site.title = 'Atados - Juntando Gente Boa';
  $scope.site.og.url = 'https://www.atados.com.br';
  $scope.site.og.image = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg';
  $scope.site.description = 'Atados é uma rede social para voluntários e ONGs.';
  

  $scope.accessPanel = function(e) {
    e.preventDefault();

    $http
      .get(api + 'contributions', {
        params: {
          email: $scope.email,
          doc: $scope.doc,
        }
      })
      .success(function(data) {
        if (data.error) {
          toastr.error('Dados insuficientes.');
        } else {
          if (!data.length) {
            toastr.error('Não foram encontradas doações com os dados informados');
          } else {
            $scope.subs = data;
          }
        }
      })
      .error(function() {
        toastr.error('Erro no servidor. Favor entrar em contato.');
      });
  };

  $scope.cancelSubscription = function(e, sub) {
    e.preventDefault();
    if (window.confirm('Deseja realmente deixar de contribuir para o atados? ):')) {
      $http
        .delete(api + 'contributions/', {
          params: {
            email: sub.email,
            doc: sub.doc,
            id: sub.id,
          }
        })
        .success(function() {
          $(e.target).closest('a').hide();
          toastr.success('Sua contribuição mensal foi cancelada ):');
        })
        .error(function() {
          toastr.error('Erro no servidor. Favor entrar em contato.');
        });
    }
  };
}]);
