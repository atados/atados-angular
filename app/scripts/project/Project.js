'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.factory('Project', function($http, $q, Restangular, Site, Auth, Cleanup, $state, api) {
  return {
    create: function (project, files, success, error) {
      var projectCopy = {};
      angular.copy(project, projectCopy);
      var causes = [];
      projectCopy.causes.forEach(function(c) {
        causes.push(c.id);
      });
      projectCopy.causes = causes;

      var skills = [];
      projectCopy.skills.forEach(function(s) {
        skills.push(s.id);
      });
      projectCopy.skills = skills;

      files.append('project', angular.toJson(projectCopy));

      $http.post(api + 'create/project/', files, {
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
      }).success(success).error(error);
    },
    save: function (project, success, error) {
      var projectCopy = {};
      angular.copy(project, projectCopy);

      delete projectCopy.nonprofit;
      delete projectCopy.volunteers;
      delete projectCopy.volunteers_numbers;
      delete projectCopy.nonprofit_city_state;
      delete projectCopy.nonprofit_image;
      delete projectCopy.image_url;

      if (projectCopy.job) {
        projectCopy.job.start_date = new Date(projectCopy.job.start_date).getTime();
        projectCopy.job.end_date = new Date(projectCopy.job.end_date).getTime();
        delete projectCopy.work;
      } else if(projectCopy.work){
        delete projectCopy.job;
      }

      var causes = [];
      projectCopy.causes.forEach(function(c) {
        if (isNaN(c)) {
          causes.push(c.id);
        } else {
          causes.push(c);
        }
      });
      projectCopy.causes = causes;

      var skills = [];
      projectCopy.skills.forEach(function(s) {
        if (isNaN(s)) {
          skills.push(s.id);
        } else {
          skills.push(s);
        }
      });
      projectCopy.skills = skills;

      $http.put(api + 'save/project/', {'project': projectCopy})
        .success(success).error(error);
    },
    get: function(slug) {
      return $q(function(r) {r(slug)})
        // First look for the project on Initial State
        // if it's not there, then request it
        .then(function(slug) {
          var initialState = window.INITIAL_STATE
          if (initialState && initialState.project && initialState.project.slug === slug) {
            return initialState.project
          }
          return Restangular.one('project', slug).get()
        })
        // Parse project
        .then(function (project) {
          var projectBelongsToLoggedUser = Auth.getLoggedUser() && project.nonprofit.id === Auth.getLoggedUser().id;
          var userIsStaff = Auth.getLoggedUser() && Auth.getLoggedUser().user.is_staff;
          if ((!project.published && !projectBelongsToLoggedUser) || (!project.published && !userIsStaff)) {
            $state.transitionTo('root.home');
            toastr.error('Vaga ainda não foi aprovada. Se isso é um erro entre em contato por favor.');
            return null;
          }
          Cleanup.project(project);
          project.gdd_org_image = project.gdd_org_image.replace('/media', '');
          project.gdd_image = project.gdd_image.replace('/media', '');
          var aux_img = project.gdd_image.split('?');
          var aux_org = project.gdd_org_image.split('?');
          project.gdd_image = aux_img[0];
          project.gdd_org_image = aux_org[0];
          return project;
        }, function() {
          $state.transitionTo('root.home');
          toastr.error('Vaga não encontrada.');
        });
    },
    createOrSave: function(project, success, error) {
      var url, req;
      if (project.id) {
        url = 'save/project/';
        req = $http.put;
      } else {
        url = 'create/project/';
        req = $http.post;
      }
      req(api + url, {'project': project})
        .success(success).error(error);
    },
  };
});
