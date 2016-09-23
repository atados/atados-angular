'use strict';

var app = angular.module('atadosApp');

app.controller('NonprofitFormCtrl', function($scope, $rootScope, $filter, $state, $http, $timeout, Nonprofit, api) {
  $scope.nonprofit = {
    name: null,
    details: null,
    description: null,
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

    if (n.facebook_page_short) {
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

    if (!n.uploaded_image) {
      client_json.image.id = n.uploaded_image.id;

      var coverFile = {
          name: n.uploaded_image.image,
          size: 0
      };

      $scope.imageDropzone.emit('addedfile', coverFile);
      $scope.imageDropzone.emit('thumbnail', coverFile, n.uploaded_image.image_url);
    }

    if (!n.uploaded_cover) {
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
      image: {
        id: n.image.id,
      },
      cover: {
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
        password: n.password
      },
      facebook_page: 'https://facebook.com/' + n.facebook_page_short,
      website: n.website,
      causes: n.causes,
    };
    return api_json;
  };

  $scope.saveNonprofit = function() {
    var json = $scope.convertNonprofitToApiFormat($scope.nonprofit);

    if (!$scope.saving && $scope.validation.valid) {
      $scope.saving = true;
      
      Nonprofit.createOrSave(json, function(data, action) {
        $scope.saving = false;
        $scope.success = true;
      }, function() {
        $scope.saving = false;
        toastr.error('Aconteceu um erro. Revise os campos e tente novamente');
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
      $scope.dzInit(this, 'image');
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
      $scope.dzInit(this, 'cover');
    }
  };

  /*
   * Watchers
   */
  $scope.$watch('nonprofit.name', function(value) {
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


  // Model watchers
  $scope.$watch('nonprofit.address.addr', function (value) { $scope.validateAddress(value); }, true);
  $scope.$watchCollection('nonprofit.causes', function() { $scope.validateCausesOrSkills('causes'); });

  /*
   * Validation function
   */ 
  $scope.validate = function() {
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
    ($scope.nonprofitForm.email === undefined || $scope.nonprofitForm.email.$pristine) &&
    ($scope.nonprofitForm.password === undefined || $scope.nonprofitForm.password.$pristine) &&
    ($scope.nonprofitForm.phone === undefined || $scope.nonprofitForm.phone.$pristine)
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
    ($scope.nonprofitForm.email !== undefined && $scope.nonprofitForm.email.$valid) &&
    ($scope.nonprofitForm.password !== undefined && $scope.nonprofitForm.password.$valid) &&
    ($scope.nonprofitForm.phone !== undefined && $scope.nonprofitForm.phone.$valid)
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

  $scope.$watch('coverDropzone', function(e) {
    console.log('coverDropzone', e);
  });

  $scope.$watch('imageDropzone', function(e) {
    console.log('imageDropzone', e);
  });


//  $scope.nonprofit = {
//    image_url: 'https://s3.amazonaws.com/atados-us/project/default_project.jpg',
//    cover_url: 'https://s3.amazonaws.com/atados-us/project/default_project.jpg',
//    hidden_address: false,
//    address: {
//      addr:null,
//      typed_address2:null,
//    },
//    phone:null,
//    description:null,
//    name:null,
//    details:null,
//    user:{
//      name:null,
//      slug:null,
//      email:null,
//      password:null
//    },
//    facebook_page:null,
//    google_page:null,
//    twitter_handle:null,
//    website:null,
//    causes:[]
//  };
//
//  $scope.$watch('nonprofit.address.addr', function (value) {
//    if (value instanceof Object) {
//      $scope.signupForm.address.$invalid = false;
//    } else {
//      $scope.signupForm.address.$invalid = true;
//    }
//  });
//
//  $scope.buttonText = 'Finalizar cadastro';
//
//  $scope.$watch('nonprofit.user.slug', function (value) {
//    // Checking that slug not already used.
//    if (value) {
//      if (value.indexOf(' ') >= 0) {
//        $scope.signupForm.slug.$invalid = true;
//        $scope.signupForm.slug.hasSpace = true;
//      } else {
//        $scope.signupForm.slug.$invalid = false;
//        $scope.signupForm.slug.hasSpace = false;
//        Auth.isSlugUsed(value, function (response) {
//          $scope.signupForm.slug.alreadyUsed = response.alreadyUsed;
//          $scope.signupForm.slug.$invalid = response.alreadyUsed;
//        });
//      }
//    } else {
//      $scope.signupForm.slug.alreadyUsed = false;
//      $scope.signupForm.slug.hasSpace = false;
//      $scope.signupForm.slug.$invalid = false;
//    }
//  });
//
//  $scope.$watch('nonprofit.name', function(value) {
//    $http
//      .get(api + 'generate_slug/' + value + '/')
//      .success(function(data) {
//        if (data && data.slug && data.slug !== 'null' && data.slug !== 'undefined') {
//          $scope.nonprofit.user.slug = data.slug;
//        }
//      })
//      .error(function() {
//        $scope.nonprofit.user.slug = '';
//      });
//  });
//
//  $scope.cityLoaded = false;
//
//  $scope.$watch('password + passwordConfirm', function() {
//    $scope.signupForm.password.doesNotMatch = $scope.password !== $scope.passwordConfirm;
//    $scope.signupForm.password.$invalid = $scope.signupForm.password.doesNotMatch;
//  });
//
//  $scope.uploadImageFile = function(files) {
//    if (files) {
//      if (!$scope.files) {
//        $scope.files = new FormData();
//      }
//      $scope.nonprofit.image_url = URL.createObjectURL(files[0]);
//      $scope.files.append('image', files[0]);
//      $scope.imageUploaded = true;
//      $scope.$apply();
//      return;
//    }
//    $scope.imageUploaded = false;
//    $scope.$apply();
//  };
//  $scope.uploadCoverFile = function(files) {
//    if (files) {
//      if (!$scope.files) {
//        $scope.files = new FormData();
//      }
//      $scope.nonprofit.cover_url = URL.createObjectURL(files[0]);
//      $scope.files.append('cover', files[0]);
//      $scope.coverUploaded = true;
//      $scope.$apply();
//      return;
//    }
//    $scope.coverUploaded = false;
//    $scope.$apply();
//  };
//
//  $scope.signup = function () {
//    if ($scope.signupForm.$valid && $scope.nonprofit.causes.length && $scope.imageUploaded && $scope.coverUploaded) {
//      $scope.nonprofit.user.password = $scope.password;
//
//      $scope.facebook_page = 'http://facebook.com/' + $scope.facebook_page;
//      $scope.google_page = 'http://plus.google.com/' + $scope.google_page;
//      $scope.twitter_handle = 'http://www.twitter.com/' + $scope.twitter_handle;
//
//      $scope.files.append('nonprofit', angular.toJson($scope.nonprofit));
//
//      $scope.creatingNonprofit = true;
//      $scope.buttonText = 'Finalizando cadastro...';
//
//      Auth.nonprofitSignup($scope.files, function () {
//        Auth.login({
//            username: $scope.nonprofit.user.email,
//            password: $scope.nonprofit.user.password,
//            remember: true
//          }, function (response) {
//            $scope.creatingNonprofit = false;
//            $scope.buttonText = 'Finalizar cadastro';
//            Auth.getCurrentUser(response.access_token).then(
//              function (user) {
//                $rootScope.$emit('userLoggedIn', user, 'Bem vinda ONG ao atados! Sua ONG ainda precisa ser aprovada. Espere pelo nosso email.');
//                $state.transitionTo('root.nonprofitadmin');
//              }, function (error) {
//                console.error(error);
//                toastr.error('Sua ONG foi criada mas não coseguimos te logar. Clique no botão acima "ONG" e use seu email e senha para logar.');
//                $state.transitionTo('root.home');
//              });
//          }, function () {
//            $scope.error = 'Usuário ou senha estão errados :(';
//          });
//      },
//      function (error) {
//        $scope.creatingNonprofit = false;
//        $scope.buttonText = 'Finalizar cadastro';
//        if (error.detail && error.detail === 'Nonprofit already exists.') {
//          toastr.error('Esta ONG já está em nosso banco. Favor utilizar efetuar login ou entrar em contato.');
//        }
//      });
//    } else {
//      toastr.error('Ops! Parece que algum campo não foi preenchido corretamente.');
//      $scope.show_errors = true;
//    }
//  };
});
