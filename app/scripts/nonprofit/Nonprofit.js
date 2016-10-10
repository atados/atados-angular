'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.factory('Nonprofit', function(Restangular, $state, $stateParams, Cleanup, $http, api, Auth) {
  return {
    get: function (slug) {
      return Restangular.one('nonprofit', slug).get().then(function(nonprofit) {
        Cleanup.nonprofit(nonprofit);
        return nonprofit;
      }, function() {
        $state.transitionTo('root.home');
        toastr.error('ONG não existe.', $stateParams.slug);
      });
    },
    savePassword: function (email, password, slug) {
      Auth.changePassword({'email': email, 'password': password}, function () {
        toastr.success('Senha nova salva', slug);
      }, function () {
        toastr.error('Não conseguimos atualizar sua senha :(');
      });
    },
    save: function (nonprofit, success, error) {
      $http.patch(api + 'nonprofit/' + nonprofit.user.slug + '/.json', nonprofit)
        .success(function(r) {
          toastr.success('Perfil da ONG salvo!');
          success(r, 'save');
        }).error(function(r) {
          toastr.error('Problema ao salvar o perfil da ONG, por favor tente de novo');
          error(r, 'save');
        });
    },
    create: function(nonprofit, success, error) {
      $http.post(api + 'create/nonprofit/', {nonprofit: nonprofit}, {
      }).success(function(r) {
        success(r, 'create');
      }).error(function(r) {
        error(r, 'create');
      });
    },
    createOrSave: function(nonprofit, success, error) {
      if (nonprofit.id) {
        this.save(nonprofit, success, error);
      } else {
        this.create(nonprofit, success, error);
      }
    }
  };
});
