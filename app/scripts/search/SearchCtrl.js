'use strict';

/* global toastr: false */
/* global $: false */

var app = angular.module('atadosApp');

app.controller('SearchCtrl', function ($scope, $http, $location, $rootScope,
      Search, $state, storage, defaultZoom, Cleanup) {

  var alreadySearchedProject = false;
  var alreadySearchedNonprofit = false;

  var typingTimer;
  var doneTyping = false;
  var doneTypingInterval = 1000;
  var oldQuery = '';

  $scope.regions = [
    {
      'name': 'São Paulo - Capital',
      'address': {
        formatted_address: 'São Paulo, São Paulo - SP, Brasil',
        address_components: [{'long_name':'São Paulo','types':['administrative_area_level_2']}],
      }
    },
    {
      'name': 'Grande São Paulo',
      'address': {
        formatted_address: 'Região Metropolitana de São Paulo, São Paulo - SP, Brasil',
        address_components: [{'long_name':'Região Metropolitana de São Paulo','types':['colloquial_area']}],
      }
    },
    {
      'name': 'Distrito Federal',
      'address': {
        formatted_address: 'Curitiba - PR, Brasil',
        address_components: [{'long_name':'Distrito Federal','types':['administrative_area_level_1']}],
      }
    },
    {
      'name': 'Rio de Janeiro',
      'address': {
        formatted_address: 'RJ, Brasil',
        address_components: [{'long_name':'Rio de Janeiro','types':['administrative_area_level_1']}],
      }
    },
    {
      'name': 'Curitiba',
      'address': {
        formatted_address: 'Curitiba - PR, Brasil',
        address_components: [{'long_name':'Curitiba','types':['administrative_area_level_2']}],
      }
    },
    {
      'name': 'Grande Florianópolis',
      'address': {
        formatted_address: 'Grande Florianópolis, Florianópolis - SC, Brasil',
        address_components: [{'long_name':'Grande Florianópolis','types':['colloquial_area']}],
      }
    },
    {
      'name': 'Trabalho à Distância',
      'address': {
        formatted_address: '',
        address_components: [],
      }
    },
  ];

  var search = function(value, old) {
    if (value !== old) {
      if ($scope.landing && (Search.query || Search.cause.id || Search.skill.id)) {
        $state.transitionTo('root.explore');
      }
      alreadySearchedProject = false;
      alreadySearchedNonprofit = false;
      $scope.searchMoreDisabled = false;

      Search.filter(Search.query, Search.cause.id, Search.skill.id, Search.address);
      doneTyping = false;
    }
  };

  $scope.$watch('search.skill', function (value, old) {
    search(value, old);
  });
  $scope.$watch('search.cause', function (value, old) {
    search(value, old);
  });
  $scope.$watch('search.address', function(value, old) {
    search(value, old);
  });
  $scope.$watch('search.region_select', function(value, old) {
    if (value !== old) {
      $scope.search.address = value.address;
    }
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

  $scope.searchMoreProjectButtonText = 'Mostrar mais Vagas';
  $scope.searchMoreNonprofitButtonText = 'Mostrar mais ONGs';
  $scope.searchMoreDisabled = false;

  function getMoreProjects() {
    if (Search.nextUrlProject()) {
      $scope.searchMoreProjectButtonText = 'Buscando mais vagas...';
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
        toastr.error('Erro ao buscar mais vagas do servidor');
        $scope.searching = false;
      });
    } else if(!alreadySearchedProject) {
      toastr.error('Não conseguimos achar mais vagas. Tente mudar os filtros.');
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


  $scope.displayProjects = function() {
    Search.showProjects = true;
    $state.go($state.current, {tab: 'vagas'}, {notify:false, reload:$state.current});
  };

  $scope.displayNonprofits = function() {
    Search.showProjects = false;
    $state.go($state.current, {tab: 'ongs'}, {notify:false, reload:$state.current});
  };

  $scope.getMore = function () {
    if ($scope.landing) {
      $scope.$emit('landingToExplorer', {
        showProjects: Search.showProjects,
        address: Search.address,
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
