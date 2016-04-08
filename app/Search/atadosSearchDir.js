import atadosSearchTmpl from './atadosSearch.html!text';

// directive
function atadosSearch () {
  'ngInject';
  return {
    restrict: 'E',
    template: atadosSearchTmpl,
    controller: 'SearchCtrl'
  };
};

export default atadosSearch;
