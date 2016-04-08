import * as views from '/views/index';

const routes = [
  {
    name: 'root',
    url: '',
    abstract: true,
    resolve: {
      site: function (Site) {
        return Site.startup();
      },
      loggedUser: function (Auth) {
        return Auth.getCurrentUser();
      }
    },
    views: {
      root: {
        template: views.rootTmpl,
        controller: 'RootCtrl',
      }
    }
  },
  {
    name: 'root.home',
    url: '/',
    views: {
      main: {
        template: views.homeTmpl,
        controller: 'HomeCtrl'
      }
    }
  },
  {
    name: 'root.about',
    url: '/sobre',
    templateUrl: '/partials/about.html',
    controller: 'AboutCtrl'
  },
  {
    name: 'root.contact',
    url: '/contato',
    templateUrl: '/partials/contact.html',
    controller: 'ContactCtrl'
  },
  {
    name: 'root.faq',
    url: '/perguntas-frequentes',
    templateUrl: '/partials/faq.html',
    controller: 'FaqCtrl',
    resolve: {
      questions: function (Question) {
        return Question.getAll();
      }
    }
  },
  {
    name: 'root.404',
    url: '/ops',
    template: '<h1>NotFound</h1>'
  },
  {
    name: 'root.explore',
    url: '/explore/:tab',
    templateUrl: '/partials/explore.html',
    controller: 'ExplorerCtrl'
  },
  {
    name: 'root.volunteer',
    url: '/voluntario/:slug',
    templateUrl: '/partials/volunteerProfile.html',
    controller: 'VolunteerCtrl',
    resolve: {
      volunteer: function (Volunteer, $stateParams) {
        return Volunteer.get($stateParams.slug);
      }
    }
  },
  {
    name: 'root.volunteeredit',
    url: '/editar/voluntario',
    templateUrl: '/partials/volunteerEdit.html',
    controller: 'VolunteerEditCtrl'
  },
  {
    name: 'root.nonprofit',
    url: '/ong/:slug',
    templateUrl: '/partials/nonprofitProfile.html',
    controller: 'NonprofitCtrl',
    resolve: {
      nonprofit: function (Nonprofit, $stateParams) {
        return Nonprofit.get($stateParams.slug);
      }
    }
  },
  {
    name: 'root.nonprofitadmin',
    url: '/controle/:slug',
    templateUrl: '/partials/nonprofitAdminPanel.html',
    controller: 'NonprofitAdminCtrl'
  },
  {
    name: 'root.nonprofitedit',
    url: '/editar/ong/:slug',
    templateUrl: '/partials/nonprofitEdit.html',
    controller: 'NonprofitEditCtrl'
  },
  {
    name: 'root.nonprofitsignup',
      url: '/cadastro/ong',
      templateUrl: '/partials/nonprofitSignup.html',
      controller: 'NonprofitSignupCtrl',
    },
  {
    name: 'root.project',
      url: '/vaga/:slug',
      templateUrl: '/partials/projectPage.html',
      controller: 'ProjectCtrl',
      resolve: {
        project: function (Project, $stateParams) {
          return Project.get($stateParams.slug);
        }
      }
    },
  {
    name: 'root.confirmemail',
      url: '/confirmar/email/',
      controller: 'TokenCtrl'
    },
  {
    name: 'root.newproject',
    url: '/cadastro/vaga/:id',
    templateUrl: '/partials/projectNew.html',
    controller: 'ProjectNewCtrl'
  },
  {
    name: 'root.editproject',
      url: '/editar/vaga/:slug',
      templateUrl: '/partials/projectEdit.html',
      controller: 'ProjectEditCtrl'
    },
  {
    name: 'root.volunteer_success',
      url: '/atado',
      templateUrl: '/partials/joinedProject.html'
    },
  {
    name: 'legacynonprofit',
    url: '/site/instituicoes/:nonprofitUid/profile',
    controller: 'LegacyCtrl'
  },
  {
    name: 'legacyVolunteerOrNonprofit',
    url: '/site/users/:slug',
    controller: 'LegacyCtrl'
  },
  {
    name: 'root.ligandoospontos',
    url: '/ligandopontos',
    templateUrl: '/partials/ligandoospontos.html'
  },
  {
    name: 'legacyproject',
    url: '/site/vaga/:projectUid',
    controller: 'LegacyCtrl'
  },
  {
    name: 'root.contributions',
    url: '/doar/formulario/{value:/?.*}',
    templateUrl: '/partials/contributions.html',
    controller: 'ContributionsCtrl'
  },
  {
    name: 'root.contributionsPanel',
    url: '/doador',
    templateUrl: '/partials/contributionsPanel.html',
    controller: 'ContributionsPanelCtrl'
  },

  {
    name: 'root.reactTest',
    url: '/reactTest',
    templateUrl: '/components/reactTest/view.html'
  },

  {
    name: 'gdd',
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
  },
  {
    name: 'gdd.home',
    url: '/dia-das-boas-acoes',
    templateUrl: '/partials/gdd/home.html',
    controller: 'GddHomeCtrl'
  },
  {
    name: 'gdd.project',
    url: '/dia-das-boas-acoes/ato/:slug',
    templateUrl: '/partials/gdd/projectPage.html',
    controller: 'GddProjectCtrl',
    resolve: {
      project: function (Project, $stateParams) {
        return Project.get($stateParams.slug);
      }
    }
  },
  {
    name: 'gdd.nonprofitsignupsplash',
    url: '/dia-das-boas-acoes/cadastro',
    templateUrl: '/partials/gdd/nonprofitSignupSplash.html',
    controller: 'GddNonprofitSignupSplashCtrl',
  },
  {
    name: 'gdd.nonprofitsignup',
    url: '/dia-das-boas-acoes/cadastro/ong',
    templateUrl: '/partials/gdd/nonprofitSignup.html',
    controller: 'GddNonprofitSignupCtrl',
  },
  {
    name: 'gdd.nonprofitgroupsignup',
    url: '/dia-das-boas-acoes/cadastro/grupo',
    templateUrl: '/partials/gdd/nonprofitGroupSignup.html',
    controller: 'GddNonprofitGroupSignupCtrl',
  },
  {
    name: 'gdd.nonprofitadmin',
    url: '/dia-das-boas-acoes/controle/:slug',
    templateUrl: '/partials/gdd/nonprofitAdminPanel.html',
    controller: 'GddNonprofitAdminCtrl'
  },
  {
    name: 'gdd.newproject',
    url: '/dia-das-boas-acoes/cadastro/ato/:id',
    templateUrl: '/partials/gdd/projectNew.html',
    controller: 'GddProjectNewCtrl'
  },
  {
    name: 'gdd.editproject',
    url: '/dia-das-boas-acoes/editar/ato/:slug',
    templateUrl: '/partials/gdd/projectEdit.html',
    controller: 'GddProjectEditCtrl'
  },
  {
    name: 'gdd.explore',
    url: '/dia-das-boas-acoes/explore',
    templateUrl: '/partials/gdd/explore.html',
    controller: 'GddExploreCtrl'
  },
  {
    name: 'gdd.ideas',
    url: '/dia-das-boas-acoes/ideias',
    templateUrl: '/partials/gdd/ideas.html',
    controller: 'GddIdeasCtrl'
  },
  {
    name: 'gdd.nonprofit',
    url: '/dia-das-boas-acoes/ong/:slug',
    templateUrl: '/partials/gdd/nonprofitProfile.html',
    controller: 'GddNonprofitCtrl',
    resolve: {
      nonprofit: function (Nonprofit, $stateParams) {
        return Nonprofit.get($stateParams.slug);
      }
    }
  }
];

export default routes;
