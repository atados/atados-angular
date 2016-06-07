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

  var search = function(value, old) {
    if (value !== old) {
      if ($scope.landing && (Search.query || Search.cause.id || Search.skill.id || Search.address)) {
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
