'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.factory('Banner', function(Restangular) {
  return {
    get: function (slug) {
      return Restangular.all('banners')
      .getList()
      .then(function (res) {
        return res;
      }, function () {
        toastr.error('Não encontrei os banners :\'( ...');
      });
    }
  };
});
