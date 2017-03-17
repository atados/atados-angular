'use strict';

var app = angular.module('atadosApp');

app.factory('Cleanup', function ($http, $q, Site, Restangular, api, NONPROFIT) {
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

  var sanitizeProject = function(project, nonprofit) {
    setProjectStatusStyle(project);
    project.volunteers = null;

    $http.get(api + 'project/' + project.slug + '/volunteers_and_applies/').then(function(response){
      var volunteers = response.data.volunteers;//, applies = response.data.applies
      var volunteersEmails = [];

      if (volunteers && volunteers.length) {
        project.volunteers = volunteers;
        for (var i = 0, volunteer = volunteers[i]; i < volunteers.length;i++, volunteer = volunteers[i]) {
          volunteersEmails.push(volunteer.email);

          setStatusStyle(volunteer);
        }
      }

      project.emailAllString = 'mailto:' + nonprofit.user.email + '?bcc=' + volunteersEmails.join(',');
    });
  };

  var fixCauses = function (inputCauses) {
    if (inputCauses && Site.causes()) {
      var causes = [];
      inputCauses.forEach(function(c) {
        if (c.id) {
          causes.push(Site.causes()[c.id]);
        } else {
          causes.push(Site.causes()[c]);
        }
      });
      return causes;
    }
  };

  var fixSkills = function (inputSkills) {
    if (inputSkills && Site.skills()) {
      var skills = [];
      inputSkills.forEach(function(s) {
        if (s.id) {
          skills.push(Site.skills()[s.id]);
        } else {
          skills.push(Site.skills()[s]);
        }
      });
      return skills;
    }
  };

  var addDevelopmentUrl = function(image) {
    if (image && image.indexOf('http') === -1) {
      return 'http://www.atadoslocal.com.br:8000' + image;
    }
    return image;
  };

  return {
    currentUser: function (user) {
      if (!user) {
        return;
      }

      user.causes = fixCauses(user.causes);
      user.skills = fixSkills(user.skills);

      if (user.role === NONPROFIT) {
        if (user.projects) {
          user.projects.forEach(function(p) {
            p.causes = fixCauses(p.causes);
            p.skills = fixSkills(p.skills);
          });
        }
      }

      if (user.address) {
        user.address = user.user.address;
        user.address.addr = {
          formatted_address: user.address.address_line,
        };
      } else {
        user.address = {
          addr: {
            formatted_address: '',
          }
        };
      }
    },

    volunteer: function (v) {
      v.causes = fixCauses(v.causes);
      v.skills = fixSkills(v.skills);

      v.projects.forEach(function(p) {
        p.causes = fixCauses(p.causes);
        p.skills = fixSkills(p.skills);
      });

      v.nonprofits.forEach(function(n) {
        n.causes = fixCauses(n.causes);
      });
    },

    nonprofitForEdit: function (nonprofit) {
      if (nonprofit.facebook_page) {
        var parser = document.createElement('a');
        parser.href = nonprofit.facebook_page;
        nonprofit.facebook_page_short = parser.pathname || '';
        nonprofit.facebook_page_short = nonprofit.facebook_page_short.replace(/\//, '');
      }
      if (nonprofit.google_page) {
        var parser2 = document.createElement('a');
        parser2.href = nonprofit.google_page;
        nonprofit.google_page_short = parser2.pathname;
      }
      if (nonprofit.twitter_handle) {
        var parser3 = document.createElement('a');
        parser3.href = nonprofit.google_page;
        nonprofit.twitter_handle_short = parser3.pathname || '';
        nonprofit.twitter_handle_short = nonprofit.twitter_handle_short.replace(/\//, '');
      }
      if (!nonprofit.address) {
        nonprofit.address = {};
      } else {
        nonprofit.address.addr = {formatted_address: nonprofit.address.address_line};
      }
      return nonprofit;
    },
    nonprofitForAdmin: function (nonprofit) {
      if (nonprofit.facebook_page) {
        var parser = document.createElement('a');
        parser.href = nonprofit.facebook_page;
        nonprofit.facebook_page_short = parser.pathname || '';
        nonprofit.facebook_page_short = nonprofit.facebook_page_short.replace(/\//, '');
      }
      if (nonprofit.google_page) {
        var parser2 = document.createElement('a');
        parser2.href = nonprofit.google_page;
        nonprofit.google_page_short = parser2.pathname || '';
        nonprofit.google_page_short = nonprofit.google_page_short.replace(/\//, '');
      }
      if (nonprofit.twitter_handle) {
        var parser3 = document.createElement('a');
        parser3.href = nonprofit.google_page;
        nonprofit.twitter_handle_short = parser3.pathname || '';
        nonprofit.twitter_handle_short = nonprofit.twitter_handle_short.replace(/\//, '');
      }

      nonprofit.projects.forEach(function (p) {
        sanitizeProject(p, nonprofit);
      });
    },
    nonprofit: function(nonprofit) {
      nonprofit.causes = fixCauses(nonprofit.causes);
      if (nonprofit.projects) {
        nonprofit.projects.forEach(function (p) {
          p.causes = fixCauses(p.causes);
          p.skills = fixSkills(p.skills);
          p.nonprofit.slug = p.nonprofit.user.slug;
          p.nonprofit.image_url = 'https://atados-us.s3.amazonaws.com/' + p.nonprofit.image;
        });
      }
    },
    nonprofitForSearch: function (n) {
      n.image_url = addDevelopmentUrl(n.image_url);
      n.cover_url = addDevelopmentUrl(n.cover_url);
      n.causes = fixCauses(n.causes);
    },
    projectForSearch: function (p) {
      if (p.gdd) {
        if (p.gdd_org_image) {
          try {
            p.gdd_org_image = p.gdd_org_image.replace('/media', '/good-deeds-day').split('?').shift();
          } catch(err) {
            p.gdd_org_image = null
          }
        }
        if (p.gdd_image) {
          try {
            p.gdd_image = p.gdd_image.replace('/media', '/good-deeds-day').split('?').shift();
          } catch(err) {
            p.gdd_image = null
          }
        }
      }

      p.image_url = addDevelopmentUrl(p.image_url);
      p.nonprofit_image = addDevelopmentUrl(p.nonprofit_image);

      p.causes = fixCauses(p.causes);
      p.skills = fixSkills(p.skills);
    },

    adminProject: sanitizeProject,

    project: function (project) {
      project.causes = fixCauses(project.causes);
      project.skills = fixSkills(project.skills);
    },
  };
});
