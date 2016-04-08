import './vendor';
import 'angular-cookies';
import angular from 'angular';
import configureStore from '/Search/components/configureStore';
import routesCfg from '/App/routesCfg';
import facebookCfg from '/App/facebookCfg';
import restangularCfg from '/App/restangularCfg';
import securityInterceptorCfg from '/App/securityInterceptorCfg';

import '/App/module';
import '/Root/module';
import '/Home/module';
import '/Search/module';
import '/Filters/module';

const app = angular.module('atados', [
  'atados.App',
  'atados.Root',
  'atados.Home',
  'atados.Filters',
  'atados.Search',
  'restangular',
  'ui.router',
  'ui.bootstrap',
  'ngCookies',
  'toastr',
  'react',
  'ezfb',
]);

app.config(routesCfg);
app.config(facebookCfg);
app.config(restangularCfg);
app.config(securityInterceptorCfg);

export default app;
