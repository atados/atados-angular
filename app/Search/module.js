import angular from 'angular';
import Search from './Search';
import SearchCtrl from './SearchCtrl';
import searchProvider from './components/searchProvider.jsx!';
import atadosSearchDir from './atadosSearchDir';

const module = angular.module('atados.Search', [])

module.controller('SearchCtrl', SearchCtrl);
module.factory('Search', Search);
module.directive('atadosSearch', atadosSearchDir);

export default module;
