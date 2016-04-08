import authInterceptorSvc from './authInterceptorSvc'
import routes from './routes'

function routesCfg ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
  'ngInject';
  $httpProvider.interceptors.push(authInterceptorSvc);
  $locationProvider.html5Mode(true).hashPrefix('!');

  $urlRouterProvider.when('/ato/:slug', '/vaga/:slug');
  $urlRouterProvider.when('/cadastro/ato/:id', 'cadastro/vaga/:id');
  $urlRouterProvider.when('/editar/ato/:slug', 'editar/vaga/:slug');
  $urlRouterProvider.when('/site/ato/:projectUid', 'site/vaga/:projectUid');
  $urlRouterProvider.otherwise('/ops');

  routes.map((route) => $stateProvider.state(route.name, route));
};

export default routesCfg;
