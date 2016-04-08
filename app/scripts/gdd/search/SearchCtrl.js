import {storage, defaultZoom} from '/constants';

// controller
function GddSearchCtrl ($scope, $http, $location, $rootScope, Search, $state, Cleanup, Site, Restangular, toastr) {
  'ngInject';
  $scope.cityStates = Site.states;
  $scope.cityLoaded = false;
  $scope.$watch('cityState', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];

    if (value) {
      Restangular.all('cities')
      .getList({
        page_size: 3000,
        state: value.id
      })
      .then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
        });

        value.citiesLoaded = true;
        $scope.cityLoaded = true;
      });
    }
  });

  var alreadySearchedProject = false;
  var alreadySearchedNonprofit = false;

  var typingTimer;
  var doneTyping = false;
  var doneTypingInterval = 1000;
  var oldQuery = '';

  var search = function(value, old) {
    if (value !== old) {
      if ($scope.landing && (Search.query || Search.cause.id || Search.skill.id || Search.city.id)) {
        $state.transitionTo('gdd.explore');
      }
      alreadySearchedProject = false;
      alreadySearchedNonprofit = false;
      $scope.searchMoreDisabled = false;

      Search.filter(Search.query, Search.cause.id, Search.skill.id, Search.city.id, true);
      doneTyping = false;
    }
  };

  $scope.$watch('search.cause', function (value, old) {
    search(value, old);
  });
  $scope.$watch('search.skill', function (value, old) {
    search(value, old);
  });
  $scope.$watch('search.city', function (value, old) {
    search(value, old);
  });

  $('#searchInput').keyup(function(){
    clearTimeout(typingTimer);
    typingTimer = setTimeout(setDoneTyping, doneTypingInterval);
  });
  $('#searchInput').keydown(function(){
    clearTimeout(typingTimer);
  });
  // user is "finished typing," do something
  function setDoneTyping () {
    doneTyping = true;
    search(Search.query, oldQuery);
    oldQuery = Search.query;
  }

  $scope.searchMoreProjectButtonText = 'Veja mais ações';
  $scope.searchMoreNonprofitButtonText = 'Mostrar mais ONGs';
  $scope.searchMoreDisabled = false;
  $scope.hideMore = true;

  function getMoreProjects() {
    if (Search.nextUrlProject()) {
      $scope.searchMoreProjectButtonText = 'Buscando mais atos...';
      $scope.searchMoreDisabled = true;
      $scope.searching = true;
      $http.get(Search.nextUrlProject()).success( function (response) {
        response.results.forEach(function (project) {
          Cleanup.projectForSearch(project);
          Search.projects().push(project);
          $scope.searchMoreProjectButtonText = 'Mostrar mais';
          $scope.searchMoreDisabled = false;
        });
        $scope.searching = false;
        Search.setNextUrlProject(response.next);
      }).error(function () {
        toastr.error('Erro ao buscar mais atos do servidor');
        $scope.searching = false;
      });
    } else if(!alreadySearchedProject) {
      toastr.error('Não conseguimos achar mais atos. Tente mudar os filtros.');
      alreadySearchedProject = true;
      $scope.searchMoreDisabled = true;
    }
  }
  function getMoreNonprofits() {
    if (Search.nextUrlNonprofit()) {
      $scope.searchMoreNonprofitButtonText = 'Buscando mais ONGs...';
      $scope.searchMoreDisabled = true;
      $scope.searching = true;
      $http.get(Search.nextUrlNonprofit()).success( function (response) {
        response.results.forEach(function (nonprofit) {
          Cleanup.nonprofitForSearch(nonprofit);
          Search.nonprofits().push(nonprofit);
          $scope.searchMoreNonprofitButtonText = 'Mostrar mais';
          $scope.searchMoreDisabled = false;
          $scope.searching = false;
        });
        Search.setNextUrlNonprofit(response.next);
      }).error(function () {
        toastr.error('Erro ao buscar mais ONGs do servidor');
        $scope.searching = false;
      });
    } else if (!alreadySearchedNonprofit) {
      toastr.error('Não conseguimos achar mais ONGs. Tente mudar os filtros.');
      alreadySearchedNonprofit = true;
      $scope.searchMoreDisabled = true;
    }
  }

  $scope.getMore = function () {
    if ($scope.landing) {
      $scope.$emit('landingToExplorer', {
        showProjects: Search.showProjects,
        city: Search.city,
        cause: Search.cause,
        skill: Search.skill
      });
    } else if(!$scope.searching) {
      if (Search.showProjects) {
        getMoreProjects();
      } else {
        getMoreNonprofits();
      }
    }
  };
});

export default GddSearchCtrl;
