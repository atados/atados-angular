import angular from 'angular'
import when from 'when'

var app = angular.module('atadosApp');

app.factory('Site', function(Restangular, $http, storage, api) {
  var _causes = [];
  var _skills = [];
  var _cities = [];
  var _states = [];
  var _numbers = {
    projects: 0,
    nonprofits: 0,
    volunteers: 0
  };
  var _description = 'Atados é uma rede social para voluntários e ONGs.';

  return {
    description: _description,
    name : 'Atados - Juntando Gente Boa',
    title: 'Atados - Juntando Gente Boa',
    og: {
      type: 'website',
      url: 'https://www.atados.com.br',
      image: 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/landing_cover.jpg',
    },
    contactEmail: 'contato@atados.com.br',
    copyright: 'Atados, ' + (new Date()).getFullYear(),
    startup: function () {
      return when.promise((resolve, reject) => {
          if (window.INITIAL_STATE && window.INITIAL_STATE.startup){
            resolve(window.INITIAL_STATE.startup)
          } else reject()
        })
        .catch(() => $http.get(api + 'startup/').then(response => response.data))
        .done((response) => {
          _numbers = response.numbers;
          _states = response.states;
          _cities = response.cities;
          _causes = response.causes;
          _skills = response.skills || [];

          _skills.forEach(function (s) {
            s.image = storage + 'skill_' + s.id + '.png';
            s.class = 'skill_' + s.id;
          });
          _skills.splice(0, 0, {name: 'Todas Habilidades', id: ''});

          _causes = response.causes;
          _causes.forEach(function (c) {
            c.checked = false;
            c.image = storage + 'cause_' + c.id + '.png';
            c.class = 'cause_' + c.id;
          });
          _causes.splice(0, 0, {name: 'Todas Causas', id: '', class: 'cause_0'});

          return true;
        });
    },
    causes: function () {
      return _causes;
    },
    skills: function () {
      return _skills;
    },
    cities: function () {
      return _cities;
    },
    states: function () {
      return _states;
    },
    numbers: function () {
      return _numbers;
    }
  };
});
