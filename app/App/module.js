import angular from 'angular';
import AppCtrl from './AppCtrl';
import Auth from './Auth';
import Cleanup from './Cleanup';
import Site from './Site';
import 'angular-cookies';
import securityInterceptorCfg from '/App/securityInterceptorCfg';

const module = angular.module('atados.App', ['ngCookies', 'atados.Search'])

module.config(securityInterceptorCfg);

module.controller('AppCtrl', AppCtrl);
module.factory('Auth', Auth);
module.factory('Cleanup', Cleanup);
module.factory('Site', Site);

export default module;
