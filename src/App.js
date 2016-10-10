import angular from 'angular'
import 'lodash-compat'
import 'restangular'
import 'angular-gm'
import 'angular-easyfb'
import 'angular-ui-router'
import 'angular-bootstrap'
import 'angular-loading-bar'
import 'angular-scroll'
import 'atados-angular-linkify'
import './utils/angular-seo'

/* global $: false */

var app = angular.module('atadosApp', [
  'restangular',
  'ui.router',
  'ui.bootstrap',
  'AngularGM',
  'ezfb',
  'atadosConstants',
  'seo',
  'linkify',
  'angular-loading-bar',
  'duScroll'
]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.when('/ato/:slug', '/vaga/:slug');
  $urlRouterProvider.when('/cadastro/ato/:id', 'cadastro/vaga/:id');
  $urlRouterProvider.when('/editar/ato/:slug', 'editar/vaga/:slug');
  $urlRouterProvider.when('/site/ato/:projectUid', 'site/vaga/:projectUid');

  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: '/views/partials/root.html',
      controller: 'RootCtrl',
      resolve: {
        site: ['Site', function(Site) {
          return Site.startup();
        }],
        loggedUser: ['Auth', function (Auth) {
          return Auth.getCurrentUser();
        }]
      }
    })
    .state('root.home', {
      url: '/',
      templateUrl: '/views/partials/home.html',
      controller: 'HomeCtrl',
    })
    .state('root.about', {
      url: '/sobre',
      templateUrl: '/views/partials/about.html',
      controller: 'AboutCtrl'
    })
    .state('root.contact', {
      url: '/contato',
      templateUrl: '/views/partials/contact.html',
      controller: 'ContactCtrl'
    })
    .state('root.faq', {
      url: '/perguntas-frequentes',
      templateUrl: '/views/partials/faq.html',
      controller: 'FaqCtrl',
      resolve: {
        questions: ['Question', function (Question) {
          return Question.getAll();
        }]
      },
    })
    .state('root.404', {
      url: '/ops',
      templateUrl: '/views/partials/404.html'
    })
    .state('root.explore', {
      url: '/explore/:tab',
      templateUrl: '/views/partials/explore.html',
      controller: 'ExplorerCtrl'
    })
    .state('root.volunteer', {
      url: '/voluntario/:slug',
      templateUrl: '/views/partials/volunteerProfile.html',
      controller: 'VolunteerCtrl',
      resolve: {
        volunteer: ['Volunteer', '$stateParams', function (Volunteer, $stateParams) {
          return Volunteer.get($stateParams.slug);
        }]
      }
    })
    .state('root.volunteeredit', {
      url: '/editar/voluntario',
      templateUrl: '/views/partials/volunteerEdit.html',
      controller: 'VolunteerEditCtrl'
    })
    .state('root.nonprofit', {
      url: '/ong/:slug',
      templateUrl: '/views/partials/nonprofitProfile.html',
      controller: 'NonprofitCtrl',
      resolve: {
        nonprofit: ['Nonprofit', '$stateParams', function (Nonprofit, $stateParams) {
          return Nonprofit.get($stateParams.slug);
        }]
      }
    })
    .state('root.nonprofitadmin', {
      url: '/controle/:slug',
      templateUrl: '/views/partials/nonprofitAdminPanel.html',
      controller: 'NonprofitAdminCtrl'
    })
    .state('root.nonprofitedit', {
      url: '/editar/ong/:slug',
      templateUrl: '/views/partials/nonprofitEdit.html',
      controller: 'NonprofitEditCtrl'
    })
    .state('root.nonprofitsignup', {
        url: '/cadastro/ong',
        templateUrl: '/views/partials/nonprofitSignup.html',
        controller: 'NonprofitSignupCtrl',
        resolve: {}
      })
    .state('root.project', {
        url: '/vaga/:slug',
        templateUrl: '/views/partials/projectPage.html',
        controller: 'ProjectCtrl',
        resolve: {
          project: ['Project', '$stateParams', function (Project, $stateParams) {
            return Project.get($stateParams.slug);
          }]
        }
      })
    .state('root.confirmemail', {
        url: '/confirmar/email/',
        controller: 'TokenCtrl'
      })
    .state('root.newproject', {
      url: '/cadastro/vaga/:id',
        templateUrl: '/views/partials/projectNew.html',
        controller: 'ProjectNewCtrl'
      })
    .state('root.editproject', {
        url: '/editar/vaga/:slug',
        templateUrl: '/views/partials/projectEdit.html',
        controller: 'ProjectEditCtrl'
      })
    .state('root.volunteer_success', {
        url: '/atado',
        templateUrl: '/views/partials/joinedProject.html',
      })
    .state('legacynonprofit', {
        url: '/site/instituicoes/:nonprofitUid/profile',
        controller: 'LegacyCtrl'
      })
      .state('legacyVolunteerOrNonprofit', {
        url: '/site/users/:slug',
        controller: 'LegacyCtrl'
      })
      .state('root.ligandoospontos', {
        url: '/ligandopontos',
        templateUrl: '/views/partials/ligandoospontos.html'
      })
     .state('legacyproject', {
        url: '/site/vaga/:projectUid',
        controller: 'LegacyCtrl'
      })
     .state('root.contributions', {
       url: '/doar/formulario/{value:/?.*}',
       templateUrl: '/views/partials/contributions.html',
       controller: 'ContributionsCtrl'
     })
     .state('root.contributionsPanel', {
       url: '/doador',
       templateUrl: '/views/partials/contributionsPanel.html',
       controller: 'ContributionsPanelCtrl'
     })

    .state('gdd', {
      url: '',
      abstract: true,
      templateUrl: '/views/partials/gdd/root.html',
      controller: 'GddRootCtrl',
      resolve: {
        site: ['Site', function(Site) {
          return Site.startup();
        }],
        loggedUser: ['Auth', function (Auth) {
          return Auth.getCurrentUser();
        }]
      }
    })
     .state('gdd.home', {
       url: '/dia-das-boas-acoes',
       templateUrl: '/views/partials/gdd/home.html',
       controller: 'GddHomeCtrl'
     })
     .state('gdd.project', {
       url: '/dia-das-boas-acoes/ato/:slug',
       templateUrl: '/views/partials/gdd/projectPage.html',
       controller: 'GddProjectCtrl',
       resolve: {
         project: ['Project', '$stateParams', function (Project, $stateParams) {
           return Project.get($stateParams.slug);
         }]
       }
     })
     .state('gdd.nonprofitsignupsplash', {
       url: '/dia-das-boas-acoes/cadastro',
       templateUrl: '/views/partials/gdd/nonprofitSignupSplash.html',
       controller: 'GddNonprofitSignupSplashCtrl',
       resolve: {}
     })
     .state('gdd.nonprofitsignup', {
       url: '/dia-das-boas-acoes/cadastro/ong',
       templateUrl: '/views/partials/gdd/nonprofitSignup.html',
       controller: 'GddNonprofitSignupCtrl',
       resolve: {}
     })
     .state('gdd.nonprofitgroupsignup', {
       url: '/dia-das-boas-acoes/cadastro/grupo',
       templateUrl: '/views/partials/gdd/nonprofitGroupSignup.html',
       controller: 'GddNonprofitGroupSignupCtrl',
       resolve: {}
     })
     .state('gdd.nonprofitadmin', {
       url: '/dia-das-boas-acoes/controle/:slug',
       templateUrl: '/views/partials/gdd/nonprofitAdminPanel.html',
       controller: 'GddNonprofitAdminCtrl'
     })
     .state('gdd.newproject', {
       url: '/dia-das-boas-acoes/cadastro/ato/:id',
         templateUrl: '/views/partials/gdd/projectNew.html',
         controller: 'GddProjectNewCtrl'
      })
     .state('gdd.editproject', {
         url: '/dia-das-boas-acoes/editar/ato/:slug',
         templateUrl: '/views/partials/gdd/projectEdit.html',
         controller: 'GddProjectEditCtrl'
     })
     .state('gdd.explore', {
       url: '/dia-das-boas-acoes/explore',
       templateUrl: '/views/partials/gdd/explore.html',
       controller: 'GddExploreCtrl'
     })
     .state('gdd.ideas', {
       url: '/dia-das-boas-acoes/ideias',
       templateUrl: '/views/partials/gdd/ideas.html',
       controller: 'GddIdeasCtrl'
     })
     .state('gdd.nonprofit', {
       url: '/dia-das-boas-acoes/ong/:slug',
       templateUrl: '/views/partials/gdd/nonprofitProfile.html',
       controller: 'GddNonprofitCtrl',
       resolve: {
         nonprofit: ['Nonprofit', '$stateParams', function (Nonprofit, $stateParams) {
           return Nonprofit.get($stateParams.slug);
         }]
       }
     });

    $urlRouterProvider.otherwise('/ops')
  $locationProvider.html5Mode(true).hashPrefix('!');
});

app.config(function ($httpProvider, accessTokenCookie, csrfCookie, sessionIdCookie) {

  var securityInterceptor = ['$location', '$q', function($location, $q) {

    function success(response) { return response; }

    function error(response) {
      // This is when the user is not logged in
      if (response.status === 401) {
        return $q.reject(response);
      } else if (response.status === 403) {
        $.removeCookie(accessTokenCookie);
        $.removeCookie(csrfCookie);
        $.removeCookie(sessionIdCookie);
        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    }

    return function(promise) {
      return promise.then(success, error);
    };
  }];
  $httpProvider.interceptors.push(securityInterceptor);
});

app.config(function(ezfbProvider, locale, facebookClientId) {
  ezfbProvider.setLocale(locale);
  ezfbProvider.setInitParams({
    appId: facebookClientId
  });
});

app.config(function(RestangularProvider, api) {
  RestangularProvider.setBaseUrl(api);
  RestangularProvider.setRequestSuffix('/?format=json');
  RestangularProvider.setRestangularFields({
    id: 'slug'
  });
  // This function is used to map the JSON data to something Restangular expects
  RestangularProvider.setResponseExtractor( function(response, operation) {
    if (operation === 'getList') {
      // Use results as the return type, and save the result metadata
      // in _resultmeta
      var newResponse = response.results;
      newResponse._resultmeta = {
        'count': response.count,
        'next': response.next,
        'previous': response.previous,
      };
      return newResponse;
    }
    return response;
  });
});


app.config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptorService');
}]);
