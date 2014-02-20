'use strict';

/* global constants: false */

var app = angular.module('atadosApp');

app.factory('Cleanup', function ($http, $q, Site, Restangular, Work, Job) {
  var setStatusStyle = function(volunteer) {
    if (volunteer.status === 'Voluntário') {
      volunteer.statusStyle = {color: 'green'};
    } else if (volunteer.status === 'Desistente') {
      volunteer.statusStyle = {color: 'red'};
    } else if (volunteer.status === 'Candidato') {
      volunteer.statusStyle = {color: '#0081B2'};
    } else if (volunteer.status === 'Ex-Voluntário') {
      volunteer.statusStyle = {color: 'black'};
    }
  };

  var setProjectStatusStyle  = function(project) {
    if (!project.published) {
      project.statusStyle = {'background-color': '#f2ae43'}; // label-warning color
    } else if (project.closed) {
      project.statusStyle = {'background-color': '#db524b'}; // label-danger color
    } else if (!project.closed) {
      project.statusStyle = {'background-color': '#58b957'}; // label-success color
    }
  };

  var sanitizeProject = function (p, nonprofit) {
    p.emailAllString = 'mailto:' + nonprofit.user.email + '?bcc=';
    setProjectStatusStyle(p);
    Restangular.one('project', p.slug).getList('volunteers', {page_size: 1000}).then(function (response) {
      p.volunteers = response;
      p.volunteers.forEach(function (v) {
        p.emailAllString += v.email + ',';
        Restangular.all('applies').getList({project_slug: p.slug, volunteer_slug: v.slug}).then(function (a) {
          v.status = a[0].status.name;
          setStatusStyle(v);
          return;
        });
      });
    });

  };

  var fixCauses = function (inputCauses) {
    if (inputCauses) {
      var causes = [];
      inputCauses.forEach(function(c) {
        var cause = {};
        cause.id = Site.causes()[c].id;
        cause.name = Site.causes()[c].name;
        cause.class = Site.causes()[c].class;
        cause.image = Site.causes()[c].image;
        cause.checked = true;
        causes.push(cause);
      });
      return causes;
    }
  };

  var fixSkills = function (inputSkills) {
    if (inputSkills) {
      var skills = [];
      inputSkills.forEach(function(s) {
        var skill = {};
        skill.id = Site.skills()[s].id;
        skill.name = Site.skills()[s].name;
        skill.class = Site.skills()[s].class;
        skill.image = Site.skills()[s].image;
        skill.checked = true;
        skills.push(skill);
      });
      return skills;
    }
  };

  return {
    currentUser: function (user) {
      if (!user) {
        return;
      }

      user.causes = fixCauses(user.causes);
      user.skills = fixSkills(user.skills);
      
      if (user.role === constants.NONPROFIT) {
        if (user.projects) {
          user.projects.forEach(function(p) {
            p.causes = fixCauses(p.causes);
            p.skills = fixSkills(p.skills);
          });
        }
      }

      user.address = user.user.address;
      if (user.address && user.address.city) {
        $http.get(constants.api + 'cities/'+ user.address.city + '/').success(function (city) {
          user.address.city = city;
          if (user.address.city) {
            user.address.state = Site.states()[user.address.city.state.id - 1];
          }
        });
      }
    },

    volunteer: function (v) {

      var causes = [];
      v.causes.forEach(function(c) {
        c = Site.causes()[c];
        c.checked = true;
        causes.push(c);
      });
      v.causes = causes;

      var skills = [];
      v.skills.forEach(function(s) {
        s = Site.skills()[s];
        skills.push(s);
      });
      v.skills = skills;

      v.projects.forEach(function(p) {
        p.causes.forEach(function (c) {
          c.image = constants.storage + 'cause_' + c.id + '.png';
          c.class = 'cause_' + c.id;
        });
        p.skills.forEach(function (s) {
          s.image = constants.storage + 'skill_' + s.id + '.png';
          s.class = 'skill_' + s.id;
        });
        p.nonprofit.image_url = 'https://atadosapp.s3.amazonaws.com/' + p.nonprofit.image;
        p.nonprofit.slug = p.nonprofit.user.slug;
      });

      v.nonprofits.forEach(function(n) {
        var causes = [];
        n.causes.forEach(function (c) {
          c = Site.causes()[c];
          causes.push(c);
          c.image = constants.storage + 'cause_' + c.id + '.png';
          c.class = 'cause_' + c.id;
        });
        n.causes = causes;
        n.address = n.user.address;
      });
    },

    nonprofitForAdmin: function (nonprofit) {
      if (nonprofit.facebook_page) {
        var parser = document.createElement('a');
        parser.href = nonprofit.facebook_page;
        nonprofit.facebook_page_short = parser.pathname;
        nonprofit.facebook_page_short = nonprofit.facebook_page_short.replace(/\//, '');
      }
      if (nonprofit.google_page) {
        var parser2 = document.createElement('a');
        parser2.href = nonprofit.google_page;
        nonprofit.google_page_short = parser2.pathname;
        nonprofit.google_page_short = nonprofit.google_page_short.replace(/\//, '');
      }
      if (nonprofit.twitter_handle) {
        var parser3 = document.createElement('a');
        parser3.href = nonprofit.google_page;
        nonprofit.twitter_handle_short = parser3.pathname;
        nonprofit.twitter_handle_short = nonprofit.twitter_handle_short.replace(/\//, '');
      }

      nonprofit.projects.forEach(function (p) {
        sanitizeProject(p, nonprofit);
      });
    },

    adminProject: sanitizeProject,

    project: function (project) {
      project.causes = fixCauses(project.causes);
      project.skills = fixSkills(project.skills);

      if (project.work) {
        var availabilities = [];
        for (var period = 0; period < 3; period++) {
          var periods = [];
          availabilities.push(periods);
          for (var weekday = 0; weekday < 7; weekday++) {
            periods.push({checked: false});
          }
        }
        project.work.availabilities.forEach(function(a) {
          availabilities[a.period][a.weekday].checked = true;
        });
        project.work.availabilities = availabilities;
      }
    },
  };
});