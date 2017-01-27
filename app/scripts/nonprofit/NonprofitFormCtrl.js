'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('NonprofitFormCtrl', function($scope, $rootScope, $filter, $state, $http, $timeout, Nonprofit, api, Auth) {
  $scope.nonprofit = {
    name: null,
    details: null,
    description: null,
    image: { id: null },
    cover: { id: null },
    image: { id: null },
    cover: { id: null },
    causes: [],
    website: null,
    facebook_page_short: null,
    hidden_address: false,
    password: null,
    address: {},
  };

  $scope.tmp = {
    cause: null,
  };

  $scope.validation = {
    valid: false,
    step1: {pristine: true, valid: false},
  };


  $scope.saving = false;

  if ($scope.project) {
    $scope.insideProject = true;
  }



  /*
   * Save and load
   */
  $scope.convertNonprofitToClientFormat = function(n) {
    var client_json = {
      id: n.id,
      name: n.name,
      slug: n.slug,
      description: n.description,
      details: n.details,
      image: {id: null},
      cover: {id: null},
      causes: [],
      phone: n.user.phone,
      website: n.website,
      email: n.user.email,
      hidden_address: n.user.hidden_address,
      facebook_page_short: null,
      password: null
    };

    if (n.causes) {
      angular.forEach(n.causes, function(c) {
        client_json.causes.push({id: c.id, name: c.name});
      });
    }

    if (n.facebook_page) {
      var parser = document.createElement('a');
      parser.href = n.facebook_page;
      client_json.facebook_page_short = parser.pathname;
      client_json.facebook_page_short = client_json.facebook_page_short.replace(/\//, '');
    }

    if (n.user.address && n.user.address.address_line) {
      client_json.address = {
        addr: {
          formatted_address: n.user.address.address_line,
        },
        typed_address2: n.user.address.typed_address2
      };
    }

    if (n.uploaded_image) {
      client_json.image.id = n.uploaded_image.id;

      var coverFile = {
          name: n.uploaded_image.image,
          size: 0
      };

      $scope.imageDropzone.emit('addedfile', coverFile);
      $scope.imageDropzone.emit('thumbnail', coverFile, n.uploaded_image.image_url);
    }

    if (n.uploaded_cover) {
      client_json.cover.id = n.uploaded_cover.id;

      var logoFile = {
          name: n.uploaded_cover.cover,
          size: 0
      };

      $scope.coverDropzone.emit('addedfile', logoFile);
      $scope.coverDropzone.emit('thumbnail', logoFile, n.uploaded_cover.image_url);
    }

    return client_json;
  };

  $scope.convertNonprofitToApiFormat = function(n) {
    var api_json = {
      uploaded_image: {
        id: n.image.id,
      },
      uploaded_cover: {
        id: n.cover.id,
      },
      hidden_address: n.hidden_address,
      address: {
        addr: {
          formatted_address: n.address.addr.formatted_address,
        },
        typed_address2: n.address.typed_address2,
      },
      phone: n.phone,
      description: n.description,
      name: n.name,
      details: n.details,
      user: {
        name: n.name,
        slug: n.slug,
        email: n.email,
        password: n.password,
      },
      facebook_page: 'https://facebook.com/' + n.facebook_page_short,
      website: n.website,
      causes: n.causes,
    };

    if (n.id) {
      api_json.id = n.id;
      api_json.user.password = n.newPassword;
      api_json.user.address = api_json.address;
      api_json.user.hidden_address = n.hidden_address;
      api_json.user.is_staff = false;
      api_json.user.phone = n.phone;

      var causes = [];
      angular.forEach(api_json.causes, function(v) {
        causes.push(v.id);
      });
      api_json.causes = causes;
    }

    return api_json;
  };

  $scope.saveNonprofit = function(s, e) {
    var json = $scope.convertNonprofitToApiFormat($scope.nonprofit);

    if (!$scope.saving && $scope.validation.valid) {
      $scope.saving = true;

      Nonprofit.createOrSave(json, function(data, action) {
        if (action === 'create') {
          Auth.login({
            username: $scope.nonprofit.email,
            password: $scope.nonprofit.password,
            remember: true,
          }, function(response) {
            $scope.saving = false;

            Auth.getCurrentUser(response.access_token).then(
              function (user) {
                $scope.saving = true
                if (s) {
                  $rootScope.$emit('userLoggedIn', user, null, function() {
                    $scope.saving = false
                    if (s) { s(); }
                  });
                } else {
                  $scope.saving = false
                  $rootScope.$emit('userLoggedIn', user);
                }
              }, function (error) {
                toastr.error(error);
              });
          }, function() {
            if (e) { e(); }
          });
        } else {
          $scope.saving = false;
          //$scope.success = true; // commented to avoid flickering
          $state.go('root.nonprofitadmin', {slug: $scope.nonprofit.slug});
        }
      }, function(response, action) {
        $scope.saving = false;
        $scope.success = false;
        if ((response.detail == "Nonprofit already exists.") || (response.status == 409)) {
          toastr.error('O Email da ONG informado já está cadastrado em nossa plataforma, verifique quem cadastrou em sua ONG ou envie um e-mail para: contato@atados.com.br');
        } else {
          toastr.error('Aconteceu um erro. Revise os campos e tente novamente');
        }
        if (e) { e(); }
      });
    }
  };


  /*
   * Causes
   */
  $scope.filteredCauses = $filter('filter')($scope.causes(), {name: '!Todas Causas'});

  $scope.removeCause = function(id) {
    $scope.nonprofit.causes = $filter('filter')($scope.nonprofit.causes, {id: '!'+id});
  };

  $scope.$watch('tmp.cause', function(value) {
    if (value) {
      if ($scope.nonprofit.causes.length < 3) {
        if (!$filter('filter')($scope.nonprofit.causes, {id: value.id}).length) { // check for duplicates
          $scope.nonprofit.causes.push(value);
        }
        $scope.validateCausesOrSkills('causes'); // gotta trigger it even if values don't change
                                                 // because tmp.cause is attached to nonprofitForm.causes
      }
    }
  });


  /*
   * Validation functions
   */
  $scope.validateCausesOrSkills = function(label) {
    if ($scope.nonprofitForm[label]) {
      if ($scope.nonprofitForm[label].$setValidity) {
        if ($scope.nonprofit[label].length) {
          $scope.nonprofitForm[label].$setValidity('required', true);
        } else {
          $scope.nonprofitForm[label].$setValidity('required', false);
        }
      }
    }
  };

  $scope.validateAddress = function(value) {
    if ($scope.nonprofitForm.address) {
      if ($scope.nonprofitForm.address.$setValidity) {
        if (value instanceof Object) {
          $scope.nonprofitForm.address.$setValidity('string', true);
        } else {
          $scope.nonprofitForm.address.$setValidity('string', false);
        }
      }
    }
  };

  /*
   * Dropzone
   */
  $scope.dzAddedFile = function() {
  };

  $scope.dzError = function() {
  };

  $scope.dzInit = function(inst, key) {
    inst.on('addedfile', function(f) {
      if (!inst.files.length) { // only triggered if loading nonprofit(.emit('addedfile'))
        inst.files.push(f);
      }
      if (inst.files[1] !== null && inst.files[1] !== undefined){
        inst.removeFile(inst.files[0]);
      }
    });

    inst.on('complete', function (file) {
      if (file.xhr.status === 201) {
        var result = JSON.parse(file.xhr.response);
        if (result.id) {
          $scope.nonprofitForm[key].$setViewValue(result.id);
          return;
        }
      }
      $scope.nonprofitForm[key].$setViewValue(null);
    });
  };

  $scope.imageDropzoneConfig = {
    parallelUploads: 3,
    maxFileSize: 30,
    url: api+'uploads/images/',
    paramName: 'image',
    headers: {
      'X-Atados-Unauthenticated-Upload': true,
    },
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
        $scope.imgComplete(file, 'image');
      });
    }
  };

  $scope.coverDropzoneConfig = {
    parallelUploads: 3,
    maxFileSize: 30,
    url: api+'uploads/images/',
    paramName: 'image',
    headers: {
      'X-Atados-Unauthenticated-Upload': true,
    },
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
        $scope.imgComplete(file, 'cover');
      });
    }
  };

  $scope.imgComplete = function(file, attr) {
    if (file.xhr.status === 201) {
      var result = JSON.parse(file.xhr.response);
      if (result.id) {
        $scope.nonprofitForm[attr].$setViewValue(result.id);
        return;
      }
    }
    $scope.nonprofitForm[attr].$setViewValue(null);
  };

  /*
   * Watchers
   */
  $scope.$watch('nonprofit.name', function(value) {
    if (!$scope.loadedNonprofit) {
      $http
        .get(api + 'generate_slug/' + value + '/')
        .success(function(data) {
          if (data && data.slug && data.slug !== 'null' && data.slug !== 'undefined') {
            $scope.nonprofit.slug = data.slug;
          }
        })
        .error(function() {
          $scope.nonprofit.user.slug = '';
        });
    }
  });

  /*
   * Validation watchers
   */ 
  // Form watchers
  $scope.$watch('nonprofitForm.name.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.description.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.details.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.image.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.cover.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.phone.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.address.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.causes.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.website.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.facebook_page_short.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.email.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.password.$valid', function() { $scope.validate(); });
  $scope.$watch('nonprofitForm.newPassword.$valid', function() { $scope.validate(); }); // used only on edit


  // Model watchers
  $scope.$watch('nonprofit.address.addr', function (value) { $scope.validateAddress(value); }, true);
  $scope.$watchCollection('nonprofit.causes', function() { $scope.validateCausesOrSkills('causes'); });

  /*
   * Validation function
   */ 
  $scope.validate = function() {
    // we validate differently for creating and editing
    // watch ou for loadedNonprofit
    if (
      ($scope.nonprofitForm.name === undefined || $scope.nonprofitForm.name.$pristine) &&
      ($scope.nonprofitForm.description === undefined || $scope.nonprofitForm.description.$pristine) &&
      ($scope.nonprofitForm.details === undefined || $scope.nonprofitForm.details.$pristine) &&
      ($scope.nonprofitForm.image === undefined || $scope.nonprofitForm.image.$pristine) &&
      ($scope.nonprofitForm.cover === undefined || $scope.nonprofitForm.cover.$pristine) &&
      ($scope.nonprofitForm.address === undefined || $scope.nonprofitForm.address.$pristine) &&
      ($scope.nonprofitForm.causes === undefined || $scope.nonprofitForm.causes.$pristine) &&
      ($scope.nonprofitForm.website === undefined || $scope.nonprofitForm.website.$pristine) &&
      ($scope.nonprofitForm.facebook_page_short === undefined || $scope.nonprofitForm.facebook_page_short.$pristine) &&
      ($scope.nonprofitForm.phone === undefined || $scope.nonprofitForm.phone.$pristine) &&
      (
        (!$scope.loadedNonprofit &&
          ($scope.nonprofitForm.password === undefined || $scope.nonprofitForm.password.$pristine) &&
          ($scope.nonprofitForm.email === undefined || $scope.nonprofitForm.email.$pristine)
        ) ||
        ($scope.loadedNonprofit && 
          ($scope.nonprofitForm.newPassword === undefined || $scope.nonprofitForm.newPassword.$pristine)
        )
      )
    ) {
      $scope.validation.step1.pristine = true;
    } else {
      $scope.validation.step1.pristine = false;
    }

    if (
      ($scope.nonprofitForm.name !== undefined && $scope.nonprofitForm.name.$valid) &&
      ($scope.nonprofitForm.description !== undefined && $scope.nonprofitForm.description.$valid) &&
      ($scope.nonprofitForm.details !== undefined && $scope.nonprofitForm.details.$valid) &&
      ($scope.nonprofitForm.image !== undefined && $scope.nonprofitForm.image.$valid) &&
      ($scope.nonprofitForm.cover !== undefined && $scope.nonprofitForm.cover.$valid) &&
      ($scope.nonprofitForm.address !== undefined && $scope.nonprofitForm.address.$valid) &&
      ($scope.nonprofitForm.causes !== undefined && $scope.nonprofitForm.causes.$valid) &&
      ($scope.nonprofitForm.website !== undefined && $scope.nonprofitForm.website.$valid) &&
      ($scope.nonprofitForm.facebook_page_short !== undefined && $scope.nonprofitForm.facebook_page_short.$valid) &&
      ($scope.nonprofitForm.phone !== undefined && $scope.nonprofitForm.phone.$valid) &&
      (
        (!$scope.loadedNonprofit &&
          ($scope.nonprofitForm.password !== undefined && $scope.nonprofitForm.password.$valid)  &&
          ($scope.nonprofitForm.email !== undefined && $scope.nonprofitForm.email.$valid)
        ) ||
        ($scope.loadedNonprofit && 
          ($scope.nonprofitForm.newPassword !== undefined && $scope.nonprofitForm.newPassword.$valid)
        )
      )
    ) {
      $scope.validation.step1.valid = true;
    } else {
      $scope.validation.step1.valid = false;
    }

    if ($scope.validation.step1.valid) {
      $scope.validation.valid = true;
    } else {
      $scope.validation.valid = false;
    }
  };

  /*
   * Loader
   */
  $scope.load = function() {
    if ($scope.loadedNonprofit) {
      $scope.nonprofit = $scope.convertNonprofitToClientFormat($scope.loadedNonprofit);
      $scope.nonprofitForm.$setDirty();
      angular.forEach($scope.nonprofitForm, function(val, key) {
        if (!key.match(/\$/)) {
          val.$setDirty();
        }
      });
    }
  };

  // only executed after all directives are loaded
  $timeout(function() { 
    $scope.load();
  });
});
