'use strict';

var app = angular.module('atadosApp');

app.controller('GrandeSPCtrl', function ($scope, $state, Search) {
  $scope.site.title = 'Atados';
  var address = {
    formatted_address: 'Região Metropolitana de São Paulo, São Paulo - SP, Brasil',
    address_components: [{'long_name':'Região Metropolitana de São Paulo','types':['colloquial_area']}],
  };

  Search.filter(null, null, null, address);
  $state.go('root.explore', {tab: 'vagas'});
});


