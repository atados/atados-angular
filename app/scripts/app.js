import 'systemjs-hot-reloader/default-listener.js';
import './vendor';
import angular from 'angular';
import routesCfg from './app/routesCfg';
import facebookCfg from './app/facebookCfg';
import restangularCfg from './app/restangularCfg';
import securityInterceptorCfg from './app/securityInterceptorCfg';

import AppCtrl from './app/AppCtrl';
import Site from './app/Site';
import Cleanup from './app/Cleanup';
import Cookies from './app/Cookies';
import Search from './search/Search';

const app = angular.module('atadosApp', [
  'restangular',
  'ui.router',
  'ui.bootstrap',
  'toastr',
  'ezfb'
]);

app
.config(function (
  $httpProvider,
  $stateProvider,
  $urlRouterProvider,
  $locationProvider,
  RestangularProvider,
  ezfbProvider
) {
  routesCfg(
    $httpProvider,
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  );
  facebookCfg(ezfbProvider);
  restangularCfg(RestangularProvider);
  securityInterceptorCfg($httpProvider);
});

app.controller('AppCtrl', AppCtrl);

app.factory('Site', Site);
app.factory('Cleanup', Cleanup);
app.factory('Cookies', Cookies);
app.factory('Cookies', Cookies);

export default app;
export let __hotReload = true;
