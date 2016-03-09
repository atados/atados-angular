'use strict';

/* global toastr: false */

var app = angular.module('atadosApp');

app.controller('ProjectNewCtrl', function ($scope, $state, $stateParams, $timeout, Restangular, Project, NONPROFIT) {
  $scope.project = {
    name: '',
    nonprofit: null,
    address: {
      city: {},
      neighborhood: '',
      zipcode: '',
      addressline: '',
      addressline2: '',
      addressnumber: ''
    },
    description: '',
    details: '',
    responsible: '',
    phone: '',
    email: '',
    causes: [],
    skills: [],
    roles: [],
  };

  $scope.cityLoaded = false;
  $scope.$watch('project.address.state', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];

    if (value) {
      Restangular.all('cities')
      .getList({page_size: 3000, state: value.id})
      .then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
        });
        if ($scope.loggedUser.address && value.id == $scope.loggedUser.address.city.state.id) {
          $scope.project.address.city = $scope.stateCities.find(function (city) {
            return city.id == $scope.loggedUser.address.city.id;
          });
        }

        value.citiesLoaded = true;
        $scope.cityLoaded = true;
      });
    }
  });

  if (!$scope.loggedUser) {
    $state.transitionTo('root.home');
    toastr.error('Nenhum usuário logado.');
  } else if ($scope.loggedUser.user.is_staff) {
    $scope.project.nonprofit = $stateParams.id;
    $scope.project.address.state = $scope.states().find(function (s) {
      return s.id == $scope.loggedUser.address.city.state.id;
    });
  } else if ($scope.loggedUser.role !== NONPROFIT) {
    $state.transitionTo('root.home');
    toastr.error('Precisa estar logado como ONG para fazer cadastro de uma nova vaga');
  } else {
    $scope.project.nonprofit = $scope.loggedUser.id;
    $scope.project.address.state = $scope.states().find(function (s) {
      return s.id == $scope.loggedUser.address.city.state.id;
    });
  }

  $scope.job = {
    start_date: new Date(),
    end_date: new Date()
  };
  $scope.today = new Date();

  $scope.work = {
    availabilities: [],
    weekly_hours: 0,
    can_be_done_remotely: false
  };

  $scope.newRole = {
    name: '',
    prerequisites: '',
    details: '',
    vacancies: 0
  };

  $scope.jobActive = true;
  for (var period = 0; period < 3; period++) {
    var periods = [];
    $scope.work.availabilities.push(periods);
    for (var weekday = 0; weekday < 7; weekday++) {
      periods.push({checked: false, weekday: weekday, period: period});
    }
  }

  $scope.$watch('short_facebook_event', function (value) {
    if (value) {
      $scope.project.facebook_event = 'https://www.facebook.com/events/' + value;
    }
  });

  $scope.uploadProjectImage = function(files) {
    if (files) {
      if (!$scope.files) {
        $scope.files = new FormData();
      }
      $scope.photoUrl = URL.createObjectURL(files[0]);
      $scope.files.append('image', files[0]);
      $scope.imageUploaded = true;
      $scope.$apply();
      return;
    }
    console.error('Could not upload image.');
    $scope.imageUploaded = false;
    $scope.$apply();
  };

  $scope.removeRole = function (role) {
    $scope.project.roles.splice($scope.project.roles.indexOf(role), 1);
  };

  $scope.addRole = function (role) {
    if (role.vacancies && role.name && role.details) {
      $scope.project.roles.push($scope.newRole);
      $scope.newRole = {};
    } else {
      toastr.error('Esqueceu alguma informação do cargo?');
    }
  };

  $scope.createProject = function () {
    if ($scope.project.causes.length === 0) {
      toastr.error('Precisa escolher pelo menos uma causa para criar uma vaga.');
      return;
    } else if ($scope.project.skills.length === 0) {
      toastr.error('Precisa escolher pelo menos uma habilidade para criar uma vaga.');
      return;
    }

    if ($scope.jobActive) {
      $scope.project.job = {};
      $scope.job.start_date = $scope.job.start_date.getTime();
      $scope.job.end_date = $scope.job.end_date.getTime();
      angular.copy($scope.job, $scope.project.job);

      if (!!$scope.project.job.can_be_done_remotely) {
        delete $scope.project.address;
      }
    } else {
      $scope.project.work = {};
      angular.copy($scope.work, $scope.project.work);

      if (!!$scope.project.work.can_be_done_remotely) {
        delete $scope.project.address;
      }

      var ava = [];
      $scope.project.work.availabilities.forEach(function (period) {
        period.forEach(function (a) {
          if (a.checked) {
            ava.push(a);
          }
        });
      });
      $scope.project.work.availabilities = ava;
    }

    Project.create($scope.project, $scope.files, function (response) {
      toastr.success('Vaga criada com sucesso. Agora espere o Atados entrar em contato para aprovação');
      $scope.project.slug = response.slug;
      $scope.project.id = response.id;
      if (!$scope.loggedUser.user.is_staff) {
        $scope.loggedUser.projects.push($scope.project);
        $state.transitionTo('root.nonprofitadmin' , {slug: $scope.loggedUser.slug});
      } else {
        $state.transitionTo('root.home');
      }
    }, function (error) {
      console.error(error);
      toastr.error('Não consigo criar a Vaga. Entre em contato com o Atados.');
    });
  };
});
