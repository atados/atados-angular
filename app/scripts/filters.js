'use strict';

var app = angular.module('atadosApp');

app.filter('as_location_string', ['$sce', function($sce) {
  return function(address) {

    if (!address.address_line) {
      return 'Não tem endereço.';
    }

    var out = address.address_line;
    if (address.typed_address2) {
      out += '<br>' + address.typed_address2;
    }
    return $sce.trustAsHtml(out);
  };
}]);

app.filter('newlines', function ($sce) {
  return function(text) {
    if (text) {
      return $sce.trustAsHtml(text.replace(/\n/g, '<br/>'));
    }
  };
});

app.filter('noHTML', function () {
  return function(text) {
    if (text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;');
    }
  };
});

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
