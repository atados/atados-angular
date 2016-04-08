import angular from 'angular';
import HomeCtrl from './HomeCtrl';
import LandingCtrl from './LandingCtrl';
import Banner from './Banner';

const module = angular.module('atados.Home', ['atados.Search'])

module.controller('HomeCtrl', HomeCtrl);
module.controller('LandingCtrl', LandingCtrl);
module.factory('Banner', Banner);

export default module;
