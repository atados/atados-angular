'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('NonprofitAdminCtrl', function($scope, $http, $state, $stateParams, $timeout, Restangular, Photos, Cleanup, api, VOLUNTEER) {

  $scope.volunteerStatusOptions = [
    'Voluntário',
    'Candidato',
    'Desistente',
    'Ex-Voluntário'
  ];

  function setStatusStyle(volunteer) {
    if (volunteer.status === 'Voluntário') {
      volunteer.statusStyle = {color: 'green'};
    } else if (volunteer.status === 'Desistente') {
      volunteer.statusStyle = {color: 'red'};
    } else if (volunteer.status === 'Candidato') {
      volunteer.statusStyle = {color: '#0081B2'};
    } else if (volunteer.status === 'Ex-Voluntário') {
      volunteer.statusStyle = {color: 'black'};
    }
  }

  function setProjectStatusStyle(project) {
    if (!project.published) {
      project.statusStyle = {'background-color': '#f2ae43'}; // label-warning color
    } else if (project.closed) {
      project.statusStyle = {'background-color': '#db524b'}; // label-danger color
    } else if (!project.closed) {
      project.statusStyle = {'background-color': '#58b957'}; // label-success color
    }
  }

  $scope.$watch('loggedUser', function (user) {
    if (!user) {
      $state.transitionTo('root.home');
      toastr.error('ONG precisa estar logada para acessar o Painel de Controle.');
      return;
    }
    if (user.role === VOLUNTEER && !user.user.is_staff) {
      $state.transitionTo('root.home');
      toastr.error('Apenas ONGs tem acesso ao Painel de Controle');
      return;
    } else {
      $http.get(api + 'nonprofit/' + $stateParams.slug + '/')
        .success(function(response) {
          $scope.nonprofit = response;
          Cleanup.nonprofitForAdmin($scope.nonprofit);
          $scope.activeProject = $scope.nonprofit.projects[0];

          if (user.slug === $stateParams.slug) {
            Cleanup.currentUser($scope.nonprofit);
          }
        }).error(function() {
          $state.transitionTo('root.home');
          toastr.error('ONG não encontrada.');
        });
    }
  });

  $scope.changeActiveProject = function (newProject) {
    $scope.activeProject = newProject;
  };

  $scope.changingVolunteerStatus = false
  $scope.changeVolunteerStatus = function (volunteer, newStatus) {
    volunteer.status = newStatus;
    setStatusStyle(volunteer);
    $scope.changingVolunteerStatus = true
    $http
      .post(api + 'change_volunteer_status/', {volunteer: volunteer.email, project: $scope.activeProject.slug, volunteerStatus: volunteer.status})
      .then(function(){
        $scope.changingVolunteerStatus = false
      })
  };

  $scope.editProject = function (project) {
    $state.transitionTo('root.editproject', {slug: project.slug});
  };

  $scope.cloneProject = false
  $scope.cloneProject = function (project) {
    $scope.cloneProject = true
    $http.post(api + 'project/' + project.slug + '/clone/').success(function (response) {
      Cleanup.adminProject(project, $scope.nonprofit);
      $scope.nonprofit.projects.push(response);
      $scope.cloneProject = false
    });
  };

  $scope.closingOrOpeningProject = false
  $scope.closeOrOpenProject = function (project) {
    $scope.closingOrOpeningProject = true
    if (project.closed) {
      $http.put(api + 'open/project/', {'project': project.id}).then(function() {
        project.closed = false;
        setProjectStatusStyle(project);
      }).then(function(){
        $scope.closingOrOpeningProject = false
      });
    } else {
      $http.put(api + 'close/project/', {'project': project.id}).then(function() {
        project.closed = true;
        setProjectStatusStyle(project);
      }).then(function(){
        $scope.closingOrOpeningProject = false
      });
    }
  };

  $scope.exportingList = false
  $scope.exportList = function (project) {
    $scope.exportingList = true
    $http.get(api + 'project/' + project.slug + '/export/').success(function (response) {
      var dataUrl = 'data:text/csv;utf-9,' + encodeURI(response.volunteers);
      var link = document.createElement('a');
      angular.element(link)
        .attr('href', dataUrl)
        .attr('download', 'Voluntários ' + project.name); // Pretty much only works in chrome
      link.click();


      $scope.exportingList = false
    });
  };
});
