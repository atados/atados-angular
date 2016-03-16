import authInterceptorSvc from './authInterceptorSvc'
import {rootTmpl} from '../../views/index';

function routesCfg ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
  'ngInject';
  $httpProvider.interceptors.push(authInterceptorSvc);
  $locationProvider.html5Mode(true).hashPrefix('!');

  $urlRouterProvider.when('/ato/:slug', '/vaga/:slug');
  $urlRouterProvider.when('/cadastro/ato/:id', 'cadastro/vaga/:id');
  $urlRouterProvider.when('/editar/ato/:slug', 'editar/vaga/:slug');
  $urlRouterProvider.when('/site/ato/:projectUid', 'site/vaga/:projectUid');
  $urlRouterProvider.otherwise('/ops');

  $stateProvider
  .state('root', {
    url: '',
    abstract: true,
    templateUrl: rootTmpl,
    controller: 'RootCtrl',
    resolve: {
      site: function (Site) {
        return Site.startup();
      },
      loggedUser: function (Auth) {
        return Auth.getCurrentUser();
      }
    }
  })
  .state('root.home', {
    url: '/',
    templateUrl: '/partials/home.html',
    controller: 'HomeCtrl'
  })
  .state('root.about', {
    url: '/sobre',
    templateUrl: '/partials/about.html',
    controller: 'AboutCtrl'
  })
  .state('root.contact', {
    url: '/contato',
    templateUrl: '/partials/contact.html',
    controller: 'ContactCtrl'
  })
  .state('root.faq', {
    url: '/perguntas-frequentes',
    templateUrl: '/partials/faq.html',
    controller: 'FaqCtrl',
    resolve: {
      questions: function (Question) {
        return Question.getAll();
      }
    }
  })
  .state('root.404', {
    url: '/ops',
    template: '<h1>NotFound</h1>'
  })
  .state('root.explore', {
    url: '/explore/:tab',
    templateUrl: '/partials/explore.html',
    controller: 'ExplorerCtrl'
  })
  .state('root.volunteer', {
    url: '/voluntario/:slug',
    templateUrl: '/partials/volunteerProfile.html',
    controller: 'VolunteerCtrl',
    resolve: {
      volunteer: function (Volunteer, $stateParams) {
        return Volunteer.get($stateParams.slug);
      }
    }
  })
  .state('root.volunteeredit', {
    url: '/editar/voluntario',
    templateUrl: '/partials/volunteerEdit.html',
    controller: 'VolunteerEditCtrl'
  })
  .state('root.nonprofit', {
    url: '/ong/:slug',
    templateUrl: '/partials/nonprofitProfile.html',
    controller: 'NonprofitCtrl',
    resolve: {
      nonprofit: function (Nonprofit, $stateParams) {
        return Nonprofit.get($stateParams.slug);
      }
    }
  })
  .state('root.nonprofitadmin', {
    url: '/controle/:slug',
    templateUrl: '/partials/nonprofitAdminPanel.html',
    controller: 'NonprofitAdminCtrl'
  })
  .state('root.nonprofitedit', {
    url: '/editar/ong/:slug',
    templateUrl: '/partials/nonprofitEdit.html',
    controller: 'NonprofitEditCtrl'
  })
  .state('root.nonprofitsignup', {
      url: '/cadastro/ong',
      templateUrl: '/partials/nonprofitSignup.html',
      controller: 'NonprofitSignupCtrl',
    })
  .state('root.project', {
      url: '/vaga/:slug',
      templateUrl: '/partials/projectPage.html',
      controller: 'ProjectCtrl',
      resolve: {
        project: function (Project, $stateParams) {
          return Project.get($stateParams.slug);
        }
      }
    })
  .state('root.confirmemail', {
      url: '/confirmar/email/',
      controller: 'TokenCtrl'
    })
  .state('root.newproject', {
    url: '/cadastro/vaga/:id',
    templateUrl: '/partials/projectNew.html',
    controller: 'ProjectNewCtrl'
  })
  .state('root.editproject', {
      url: '/editar/vaga/:slug',
      templateUrl: '/partials/projectEdit.html',
      controller: 'ProjectEditCtrl'
    })
  .state('root.volunteer_success', {
      url: '/atado',
      templateUrl: '/partials/joinedProject.html'
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
    templateUrl: '/partials/ligandoospontos.html'
  })
  .state('legacyproject', {
    url: '/site/vaga/:projectUid',
    controller: 'LegacyCtrl'
  })
  .state('root.contributions', {
    url: '/doar/formulario/{value:/?.*}',
    templateUrl: '/partials/contributions.html',
    controller: 'ContributionsCtrl'
  })
  .state('root.contributionsPanel', {
    url: '/doador',
    templateUrl: '/partials/contributionsPanel.html',
    controller: 'ContributionsPanelCtrl'
  })

  .state('root.reactTest', {
    url: '/reactTest',
    templateUrl: '/components/reactTest/view.html'
  })

  .state('gdd', {
    url: '',
    abstract: true,
    templateUrl: '/partials/gdd/root.html',
    controller: 'GddRootCtrl',
    resolve: {
      site: function (Site) {
        return Site.startup();
      },

      loggedUser: function (Auth) {
        return Auth.getCurrentUser();
      }
    }
  })
  .state('gdd.home', {
    url: '/dia-das-boas-acoes',
    templateUrl: '/partials/gdd/home.html',
    controller: 'GddHomeCtrl'
  })
  .state('gdd.project', {
    url: '/dia-das-boas-acoes/ato/:slug',
    templateUrl: '/partials/gdd/projectPage.html',
    controller: 'GddProjectCtrl',
    resolve: {
      project: function (Project, $stateParams) {
        return Project.get($stateParams.slug);
      }
    }
  })
  .state('gdd.nonprofitsignupsplash', {
    url: '/dia-das-boas-acoes/cadastro',
    templateUrl: '/partials/gdd/nonprofitSignupSplash.html',
    controller: 'GddNonprofitSignupSplashCtrl',
  })
  .state('gdd.nonprofitsignup', {
    url: '/dia-das-boas-acoes/cadastro/ong',
    templateUrl: '/partials/gdd/nonprofitSignup.html',
    controller: 'GddNonprofitSignupCtrl',
  })
  .state('gdd.nonprofitgroupsignup', {
    url: '/dia-das-boas-acoes/cadastro/grupo',
    templateUrl: '/partials/gdd/nonprofitGroupSignup.html',
    controller: 'GddNonprofitGroupSignupCtrl',
  })
  .state('gdd.nonprofitadmin', {
    url: '/dia-das-boas-acoes/controle/:slug',
    templateUrl: '/partials/gdd/nonprofitAdminPanel.html',
    controller: 'GddNonprofitAdminCtrl'
  })
  .state('gdd.newproject', {
    url: '/dia-das-boas-acoes/cadastro/ato/:id',
    templateUrl: '/partials/gdd/projectNew.html',
    controller: 'GddProjectNewCtrl'
  })
  .state('gdd.editproject', {
    url: '/dia-das-boas-acoes/editar/ato/:slug',
    templateUrl: '/partials/gdd/projectEdit.html',
    controller: 'GddProjectEditCtrl'
  })
  .state('gdd.explore', {
    url: '/dia-das-boas-acoes/explore',
    templateUrl: '/partials/gdd/explore.html',
    controller: 'GddExploreCtrl'
  })
  .state('gdd.ideas', {
    url: '/dia-das-boas-acoes/ideias',
    templateUrl: '/partials/gdd/ideas.html',
    controller: 'GddIdeasCtrl'
  })
  .state('gdd.nonprofit', {
    url: '/dia-das-boas-acoes/ong/:slug',
    templateUrl: '/partials/gdd/nonprofitProfile.html',
    controller: 'GddNonprofitCtrl',
    resolve: {
      nonprofit: function (Nonprofit, $stateParams) {
        return Nonprofit.get($stateParams.slug);
      }
    }
  });
};

export default routesCfg;
