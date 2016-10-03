'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('ProjectFormCtrl', function ($rootScope, $scope, $state, $stateParams, $timeout, $filter, $http, $window, $modal, api, Restangular, Project) {
  var filter = $filter('filter');

  // This variable includes extra data not needed by the api, such as the "dates" param
  // it should be cleaned later
  $scope.project = {
    name: null,
    description: null,
    details: null,
    responsible: null,
    email: null,
    phone: null,
    can_be_done_remotely: null,
    causes: [],
    skills: [],
    dates: {
      type: null, // work or job
      work: {
        escription: '',
      },
      job: {
        date: {
          _d: new Date(),
        },
        start: new Date(),
        end: new Date(),
        dates: []
      }
    },
    roles: [],
    image: {
      id: null
    },
    address: null,
  };

  $scope.tmp = {
    role_name: null,
    role_details: null,
    role_vacancies: 0,

    cause: null,
    skill: null
  };

  $scope.validation = {
    valid: false,
    step1: {pristine: true, valid: false},
    step2: {pristine: true, valid: false},
    step3: {pristine: true, valid: false},
  };

  $scope.displayTimeSelection = false;
  $scope.tmp_r_day = null;
  $scope.tmp_r_period = null;

  if ($scope.loggedUser) {
    if (!$scope.loggedUser.user.is_staff) {
      $scope.nonprofit_slug = $scope.loggedUser.slug;
    } else {
      if ($scope.loggedUser.role === 'NONPROFIT') {
        // There's a route inconsistency problem here
        // the nonprofit_slug param is only on project creation route(useful only for staff creating projects for nonprofits)
        // there's no nonprofit_slug param for project edit(and there shouldn't be)
        //
        // therefore, on creation we use the state param
        if ($stateParams.nonprofit_slug) {
          $scope.nonprofit_slug = $stateParams.nonprofit_slug;
        }
        
        // and on edit we load nonprofit info from the project
        else {
          $scope.nonprofit_slug = $scope.loadedProject.nonprofit.slug;
        }
      } else {
        $state.go('root.home');
      }
    }
  } else {
  }

  /*
   * Save and load
   */
  $scope.saving = false;
  $scope.saveProject = function() {
    var json = $scope.convertProjectToApiFormat($scope.project);

    if (!$scope.saving && $scope.validation.valid) {
      if (!$scope.loadedUser) {
        $scope.saving = true;

        $scope.saveNonprofit(function() {
          $scope._save(json);
        }, function() {
          $scope.saving = false;
          $scope.error = true;
        });
      } else {
        $scope._save(json);
      }
    };
  };
  $scope._save = function(json) {
    Project.createOrSave(json, function() {
      $scope.setFormStep(6);
      $timeout(function() {
        $state.go('root.nonprofitadmin', {slug: $scope.nonprofit_slug});
      }, 5*1000);
    }, function() {
      $scope.saving = false;
      $scope.error = true;
      toastr.error('Aconteceu um erro. Revise os campos e tente novamente.');
    });
  }

  $scope.convertProjectToApiFormat = function(p) {
    if ($stateParams.nonprofit_slug) {
      p.nonprofit_slug = $stateParams.slug;
    }

    var can_be_done_remotely = false;
    if (p.can_be_done_remotely) {
      can_be_done_remotely = !!(p.can_be_done_remotely - 1);
    }
    p.can_be_done_remotely = can_be_done_remotely;

    if (p.dates.type === 'work') {
      p.work = {
        description: p.dates.work.description,
        can_be_done_remotely: can_be_done_remotely,
      };
    }

    if (p.dates.type === 'job') {
      p.job = {
        dates: p.dates.job.dates,
        can_be_done_remotely: can_be_done_remotely,
      };
    }
    return p;
  };

  $scope.convertProjectToClientFormat = function(p) {
    var client_json = {
      id: p.id,
      name: p.name,
      description: p.description,
      details: p.details,
      email: p.email,
      phone: p.phone,
      responsible: p.responsible,
      causes: [],
      skills: [],
      roles: [],
      can_be_done_remotely: 1,
      dates: {
        type: null, // work or job
        work: {
          description: '',
        },
        job: {
          dates: []
        }
      },
      image: {
        id: null
      },
    };

    if (p.causes) {
      angular.forEach(p.causes, function(c) {
        client_json.causes.push({id: c.id, name: c.name});
      });
    }

    if (p.skills) {
      angular.forEach(p.skills, function(c) {
        client_json.skills.push({id: c.id, name: c.name});
      });
    }

    if (p.roles) {
      angular.forEach(p.roles, function(c) {
        client_json.roles.push({name: c.name, details: c.details, prerequisites: c.prerequisites, vacancies: c.vacancies});
      });
    }

    if (p.job) {
      client_json.dates.type = 'job';
      client_json.can_be_done_remotely = p.job.can_be_done_remotely ? 2 : 1;

      angular.forEach(p.job.dates, function(v, k) {
        var dt = {
          name: v.name,
          start: new Date(v.start_date),
          end: new Date(v.end_date),
        };
        client_json.dates.job.dates.push(dt);
      });


    } else {
      client_json.dates.type = 'work';
      if (p.work && p.work.can_be_done_remotely) {
        client_json.can_be_done_remotely = p.work.can_be_done_remotely ? 2 : 1;
      }
      if (p.work && p.work.description) {
        client_json.dates.work.description = p.work.description;
      }
    }

    if (p.address && p.address.address_line) {
      client_json.address = {
        addr: {
          formatted_address: p.address.address_line,
        },
        typed_address2: p.address.typed_address2
      };
    }

    if (p.uploaded_image) {
      client_json.image.id = p.uploaded_image.id;

      var myFile = {
          name: p.uploaded_image.image,
          size: 0
      };

      $scope.dropzone.emit('addedfile', myFile);
      $scope.dropzone.emit('thumbnail', myFile, p.uploaded_image.image_small_url);
    }

    return client_json;
  };


  /*
   * Roles
   */
  $scope.removeRole = function(index) {
    $scope.project.roles.splice(index, 1);
  };

  $scope.editRole = function(index) {
    var role = $scope.project.roles[index];
    $scope.tmp.role_name = role.name;
    $scope.tmp.role_details = role.details;
    $scope.tmp.role_prerequisites = role.prerequisites;
    $scope.tmp.role_vacancies = role.vacancies;
    $scope.removeRole(index);
  };

  $scope.addRole = function() {
    var role = {name: $scope.tmp.role_name, details: $scope.tmp.role_details, prerequisites: $scope.tmp.role_prerequisites, vacancies: $scope.tmp.role_vacancies};

    if (!role.name) {
      window.alert('Você deve preencher o nome do cargo');
      return;
    }
    if (!role.details) {
      window.alert('Você deve preencher as funções do cargo');
      return;
    }
    if (!role.prerequisites) {
      window.alert('Você deve preencher os pré-requisitos do cargo');
      return;
    }
    if (!role.vacancies) {
      window.alert('Deve haver ao menos uma vaga para ester cago');
      return;
    }
    if (role.details.length > 1024 || role.prerequisites.length > 1024) {
      window.alert('O campo de funções e o campo de pré-requisitos não podem ultrapassar 1024 caracteres cada.');
      return;
    }

    $scope.project.roles.push(role);
    $scope.tmp.role_name = null;
    $scope.tmp.role_details = null;
    $scope.tmp.role_prerequisites = null;
    $scope.tmp.role_vacancies = 0;
  };


  /*
   * Date type
   */
  $scope.setDateType = function(type) {
    $scope.project.dates.type = type;
  };

  $scope.$watch('tmp_r_day', function() {
    $scope.addWorkAvailability();
  });

  $scope.$watch('tmp_r_period', function() {
    $scope.addWorkAvailability();
  });

  $scope.setTmpRDay = function(n) {
    $scope.tmp_r_day = n;
  }
  $scope.setTmpRPeriod = function(n) {
    $scope.tmp_r_period = n;
  }
  $scope.displayTS = function(n) {
    $scope.displayTimeSelection = true;
  }

  $scope.addWorkAvailability = function() {
    if (parseInt($scope.tmp_r_day,    10) === $scope.tmp_r_day &&
        parseInt($scope.tmp_r_period, 10) === $scope.tmp_r_period) {
      if (!$filter('filter')($scope.project.dates.work.availabilities, {weekday: $scope.tmp_r_day, period: $scope.tmp_r_period}).length) {
        $scope.project.dates.work.availabilities.push({
          weekday: $scope.tmp_r_day,
          period: $scope.tmp_r_period,
        });
      }
      $scope.tmp_r_day = null;
      $scope.tmp_r_period = null;
      $scope.displayTimeSelection = false;
    }
  };

  $scope.removeWorkAvailability = function(weekday, period) {
    $scope.project.dates.work.availabilities = 
      filter($scope.project.dates.work.availabilities, function(v) {
        return !(v.weekday === weekday && v.period === period);
      });
  };


  /*
   * Form steps
   */
  $scope.formStep = 1;

  $scope.setFormStep = function(step) {
    $scope.formStep = step;
    $window.scrollTo(0, 0);

    if ($scope.formStep == 5) {
      if ($scope.validation.valid && (($scope.nonprofitValidation.step1.valid && !$scope.loggedUser) || ($scope.loggedUser))) {
        $scope.saveProject();
      }
    }
  };


  /*
   * Skills and causes
   */
  $scope.filteredCauses = $filter('filter')($scope.causes(), {name: '!Todas Causas'});
  $scope.filteredSkills = $filter('filter')($scope.skills(), function(v) { return !(v.name === 'Todas Habilidades' || v.name === 'Outros'); });


  $scope.removeCause = function(id) {
    $scope.project.causes = $filter('filter')($scope.project.causes, {id: '!'+id});
  };

  $scope.removeSkill = function(id) {
    $scope.project.skills = $filter('filter')($scope.project.skills, {id: '!'+id});
  };

  $scope.$watch('tmp.cause', function(value) {
    if (value) {
      if ($scope.project.causes.length < 3) {
        if (!$filter('filter')($scope.project.causes, {id: value.id}).length) { // check for duplicates
          $scope.project.causes.push(value);
        }
        $scope.validateCausesOrSkills('causes'); // gotta trigger it even if values don't change
                                                 // because tmp.cause is attached to projectForm.causes
      }
    }
  });

  $scope.$watch('tmp.skill', function(value) {
    if (value) {
      if (!$filter('filter')($scope.project.skills, {id: value.id}).length) { // check for duplicates
        $scope.project.skills.push(value);
      }
      $scope.validateCausesOrSkills('skills');
    }
  });


  /*
   * Dropzone
   */
  $scope.dzAddedFile = function() {
  };

  $scope.dzError = function() {
  };

  $scope.dropzoneConfig = {
    parallelUploads: 3,
    maxFileSize: 30,
    url: api+'uploads/images/',
    paramName: 'image',
    headers: {
      Authorization: $http.defaults.headers.common.Authorization,
      'X-Atados-Unauthenticated-Upload': true,
    }, // we send both the auth header and unauthenticated-upload header as the user may be logged out at this stage
    init: function() {
      this.on('addedfile', function(f) {
        if (!this.files.length) { // only triggered if loading project(.emit('addedfile'))
          this.files.push(f);
        }
        if (this.files[1] !== null && this.files[1] !== undefined){
          this.removeFile(this.files[0]);
        }
      });

      this.on('complete', function (file) {
        if (file.xhr.status === 201) {
          var result = JSON.parse(file.xhr.response);
          if (result.id) {
            $scope.projectForm.image.$setViewValue(result.id);
            return;
          }
        }
        $scope.projectForm.image.$setViewValue(null);
      });
    }
  };

  /*
   * Login event
   */ 
  $rootScope.$on('userLoggedIn', function(e, u) {
    if (u.role === 'NONPROFIT') {
      $scope.nonprofit_slug = u.slug;
      if ($scope.formStep === 101) {
        $scope.setFormStep(4);
      }
    } else {
      $state.go('root.home');
    }
  });

  /*
   * Date modal
   */
  $scope.openDateModal = function() {
    var dateModal = $modal.open({
      backdrop: 'static',
      keyboard: false,
      templateUrl: '/partials/dateModal.html',
      controller: ['$scope', function (scope) {
        scope.dates = {
          name: '',
          dates: [

          ],
          start: new Date(),
          end: new Date(),
        };

        scope.$watch('dates.start', function () { scope.validateDate(); }, true);
        scope.$watch('dates.end', function () { scope.validateDate(); }, true);
        scope.$watch('dates.dates', function () { scope.validateDate(); }, true);

        scope.validateDate = function() {
          var start = scope.dates.start;
          var end = scope.dates.end;
          var job_time_valid = end.getHours() > start.getHours() || (end.getHours() === start.getHours() && end.getMinutes() >= start.getMinutes());

          scope.dateForm.end.$setValidity('job_time', job_time_valid);
          scope.dateForm.date_input.$setValidity('required', (scope.dates.dates.length > 0));
        };

        scope.cancel = function() {
          dateModal.close();
        };
        scope.save = function() {
          $scope.addDate(scope.dates, function() {
            dateModal.close();
          });
        };
      }]
    });
  };

  $scope.addDate = function(dates, s, e) {
    angular.forEach(dates.dates, function(date) {
      if (!dates.name) {
         dates.name = 'Ação';
      }
      var st = angular.copy(dates.start);
      var end = angular.copy(dates.end);
      st.setDate(date._d.getDate());
      st.setMonth(date._d.getMonth());
      st.setYear(date._d.getYear());
      end.setDate(date._d.getDate());
      end.setMonth(date._d.getMonth());
      end.setYear(date._d.getYear());

      $scope.project.dates.job.dates.push({
        name: dates.name,
        start: st,
        end: end,
        date: date._d
      });
    });
    console.log($scope.project.dates.job.dates);
    s();
  }

  $scope.removeDate = function(date) {
    if (confirm('Deseja remover esta data da ação? Essa ação não poderá ser desfeita.')) {
      $scope.project.dates.job.dates = $filter('filter')($scope.project.dates.job.dates, {$$hashKey: '!'+date.$$hashKey});
    }
  };


  /*
   * Validation functions
   */
  $scope.validateCausesOrSkills = function(label) {
    if ($scope.project[label]) {
      if ($scope.project[label].length) {
        $scope.projectForm[label].$valid = true;
        $scope.projectForm[label].$invalid = false;
        $scope.projectForm[label].$error.required = false;
      } else {
        $scope.projectForm[label].$valid = false;
        $scope.projectForm[label].$invalid = true;
        $scope.projectForm[label].$error.required = true;
      }
    }
  };

  $scope.validateDateType = function() {
    if ($scope.project.dates.type) {
      $scope.projectForm.date_type.$setDirty();
      $scope.projectForm.date_type.$setValidity('required', true);


      if ($scope.project.dates.type === 'work') {
        $scope.projectForm.date_type.$setValidity('work_required', $scope.projectForm.work_description.$valid);
        $scope.projectForm.date_type.$setValidity('job_required', true);
      }

      if ($scope.project.dates.type === 'job') {
        $scope.projectForm.date_type.$setValidity('work_required', true);
        $scope.projectForm.date_type.$setValidity('job_required', !!$scope.project.dates.job.dates.length);
      }
    } else {
      $scope.projectForm.date_type.$setValidity('required', false);
    }
  };

  $scope.validateAddress = function(value) {
    if (value instanceof Object) {
      $scope.projectForm.address.$setValidity('string', true);
    } else {
      $scope.projectForm.address.$setValidity('string', false);
    }
  };

  /*
   * Validation watchers
   */ 
  // watching individual fields is the only way I found of doing this
  // Form watchers
  $scope.$watch('projectForm.name.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.description.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.causes.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.skills.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.can_be_done_remotely.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.details.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.responsible.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.email.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.phone.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.address.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.date_type.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.image.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.email.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.password.$valid', function() { $scope.validate(); });
  $scope.$watch('projectForm.work_description.$valid', function() { $scope.validateDateType(); });


  // Model watchers
  $scope.$watch('project.address.addr', function (value) { $scope.validateAddress(value); }, true);
  $scope.$watchCollection('project.causes', function() { $scope.validateCausesOrSkills('causes'); });
  $scope.$watchCollection('project.skills', function() { $scope.validateCausesOrSkills('skills'); });

  $scope.$watch('project.dates.type', function () { $scope.validateDateType(); }, true);
  $scope.$watch('project.dates.work.description', function () { $scope.validateDateType(); }, true);
  $scope.$watch('project.dates.job.dates', function () { $scope.validateDateType(); }, true);


  $scope.validate = function() {
    if ($scope.projectForm.name.$pristine && $scope.projectForm.description.$pristine && $scope.projectForm.causes.$pristine && $scope.projectForm.skills.$pristine && $scope.projectForm.can_be_done_remotely.$pristine && $scope.projectForm.address.$pristine && $scope.projectForm.date_type.$pristine && $scope.projectForm.image.$pristine) {
      $scope.validation.step1.pristine = true;
    } else {
      $scope.validation.step1.pristine = false;
    }

    if ($scope.projectForm.details.$pristine) {
      $scope.validation.step2.pristine = true;
    } else {
      $scope.validation.step2.pristine = false;
    }

    if ($scope.projectForm.responsible.$pristine && $scope.projectForm.email.$pristine && ($scope.projectForm.phone === undefined || $scope.projectForm.phone.$pristine)) {
      $scope.validation.step3.pristine = true;
    } else {
      $scope.validation.step3.pristine = false;
    }

    if ($scope.projectForm.name.$valid && $scope.projectForm.description.$valid && $scope.projectForm.causes.$valid && $scope.projectForm.skills.$valid && $scope.projectForm.can_be_done_remotely.$valid && $scope.projectForm.address.$valid && $scope.projectForm.date_type.$valid && $scope.projectForm.image.$valid) {
      $scope.validation.step1.valid = true;
    } else {
      $scope.validation.step1.valid = false;
    }

    if ($scope.projectForm.details.$valid) {
      $scope.validation.step2.valid = true;
    } else {
      $scope.validation.step2.valid = false;
    }

    if ($scope.projectForm.responsible.$valid && $scope.projectForm.email.$valid && ($scope.projectForm.phone !== undefined && $scope.projectForm.phone.$valid)) {
      $scope.validation.step3.valid = true;
    } else {
      $scope.validation.step3.valid = false;
    }

    if ($scope.validation.step1.valid && $scope.validation.step2.valid && $scope.validation.step3.valid) {
      $scope.validation.valid = true;
    } else {
      $scope.validation.valid = false;
    }
  };


  /*
   * Loader
   */
  $scope.load = function() {
    if ($scope.loadedProject) {
      $scope.project = $scope.convertProjectToClientFormat($scope.loadedProject);
      $scope.projectForm.$setDirty();
      angular.forEach($scope.projectForm, function(val, key){
        if(!key.match(/\$/)) {
          val.$setDirty();
        }
      });
      $scope.validateDateType();
    }
  };

  $scope.$watch('dropzone', function(e) {
    console.log('dropzone', e);
  });

  // only executed after all directives are loaded
  $timeout(function() { 
    $scope.load();
  });
});
