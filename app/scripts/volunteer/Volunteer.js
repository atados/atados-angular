'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.factory('Volunteer', function($http, $state, Restangular, Cleanup, api) {
  return {
    get: function(slug) {
      return Restangular.one('volunteers_public', slug).get().then(function(volunteer) {
        Cleanup.volunteer(volunteer);
        return volunteer;
      }, function() {
        $state.transitionTo('root.home');
        toastr.error('Voluntário não encontrado');
      });
    },
    save: function (volunteer, success, error) {
      var volunteerCopy = {};
      angular.copy(volunteer, volunteerCopy);

      if (volunteerCopy.birthDate) {
        if (typeof volunteerCopy.birthDate.getFullYear !== 'undefined') {
          volunteerCopy.birthDate = volunteerCopy.birthDate.getFullYear() + '-' + (volunteerCopy.birthDate.getMonth() + 1) + '-' + volunteerCopy.birthDate.getDate();
        }
      }

      volunteerCopy.user.address.typed_address = volunteerCopy.user.address.addr.formatted_address;

      delete volunteerCopy.projects;
      delete volunteerCopy.nonprofits;
      delete volunteerCopy.skills;
      delete volunteerCopy.causes;
      delete volunteerCopy.user.address.id;
      delete volunteerCopy.user.address.lat;
      delete volunteerCopy.user.address.lng;
      delete volunteerCopy.user.address.addr;
      delete volunteerCopy.user.address.address_line;

      $http.put(api + 'volunteers/' + volunteerCopy.slug + '/.json', volunteerCopy)
        .success(success).error(error);
    }
  };
});
