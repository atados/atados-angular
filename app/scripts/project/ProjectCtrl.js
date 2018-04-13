'use strict';

/* global toastr: false */
/* global google: false */
/* global dataLayer: false */

var app = angular.module('atadosApp');

app.controller('ProjectCtrl', function($scope, $rootScope, $state, $stateParams, $location, $http, Auth, $modal, Volunteer, project, api, VOLUNTEER) {

  $scope.landing = false;
  $scope.markers = [];
  $scope.project = project;
  $scope.nonprofit = $scope.project.nonprofit;
  $scope.site.title = 'Vaga - ' + $scope.project.name;
  $scope.site.description = $scope.project.description;
  $scope.site.og.url = 'https://www.atados.com.br/vaga/' + project.slug;
  $scope.site.og.image = project.image_url;
  $scope.markers.push(project.address);
  $scope.showTimeTable = false;

  if ($scope.project.published) {
    $scope.isRemote = function (project) {
      var remote = (project.work && project.work.can_be_done_remotely) || (project.job && project.job.can_be_done_remotely);
      var address = (project.address && project.address.address_line);
      return remote || !address;
    };

    if ($scope.project.address) {
      $scope.options = {
        map: {
          center: new google.maps.LatLng($scope.project.address.lat, $scope.project.address.lng),
          zoom: 15,
        },
      };
    }

    if ($scope.loggedUser && $scope.loggedUser.role === VOLUNTEER) {
      $http.get(api + 'has_volunteer_applied/?project=' + project.id.toString())
        .success(function (response) {
          if (response[0] === 'YES') {
            $scope.alreadyApplied = true;
          } else {
            $scope.alreadyApplied = false;
          }
        });
    }

    if ($scope.project.job) {
      var start = new Date($scope.project.job.start_date);
      var end = new Date($scope.project.job.end_date);
      $scope.projectJobInOneDay = start.getDay() === end.getDay() &&
                                  start.getMonth() === end.getMonth() &&
                                  start.getYear() === end.getYear();
    }

    if ($scope.project.work) {
      if ($scope.project.work.availabilities) {
        if ($scope.project.work.availabilities.length) {
          $scope.showTimeTable = true;
        }
      }
    }



    $rootScope.$on('userLoggedIn', function(/*event, user*/) {
      if ($state.is('root.project') && $scope.showApplyModal && !$scope.alreadyApplied) {
        openApplyModal();
      }
      else {
        $scope.showApplyModal = false;
        $scope.applyingVolunteerToProject = false;
      }
    });

    $rootScope.$on('userLoggedOut', function(/*event,*/) {
      $scope.alreadyApplied = false;
    });

    $scope.showApplyModal = false;
    $scope.applyingVolunteerToProject = false;

    $scope.applyVolunteerToProject = function () {
      if ($scope.project.gdd) {
        openApplyModal();
        return false;
      }

      if (!$scope.loggedUser) {
        $scope.openLogin();
        $scope.showApplyModal = true;
        $scope.applyingVolunteerToProject = true;
        toastr.info('Você tem que logar primeiro!');
      } else {
        openApplyModal();
      }
    };
  }

  function openApplyModal () {
    var template = '/partials/volunteerContractModal.html';
    var controller = 'ProjectModalCtrl';
  
    if ($scope.alreadyApplied) {
      template = '/partials/volunteerUnapplyModal.html';
      controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
          $scope.showApplyModal = false;
          $scope.applyingVolunteerToProject = false
        };
      }];
    }

    var modalInstance = $modal.open({
      templateUrl: template,
      resolve: {
        nonprofit: function () {
          return ($scope.loggedUser) ? $scope.project.nonprofit : '';
        },
        projectName: function () {
          return ($scope.loggedUser) ? $scope.project.name : '';
        },
        phone: function () {
          return ($scope.loggedUser) ? $scope.loggedUser.user.phone : '';
        },
        name: function () {
          return ($scope.loggedUser) ? $scope.loggedUser.user.name : '';
        }
      },
      controller: controller
    });

    modalInstance.result.then(function (modalDetails) {

      var volunteerMessage = '';
      var volunteerPhone = '';
      var volunteerName = '';
      var volunteerEmail = '';

      if (modalDetails && !$scope.project.gdd) {
        volunteerMessage = modalDetails.message;
        $scope.loggedUser.user.phone = volunteerPhone = modalDetails.phone;
        $scope.loggedUser.user.name = volunteerName = modalDetails.name;
        volunteerEmail = modalDetails.email;
      } else {
        volunteerMessage = modalDetails.message;
        volunteerPhone = modalDetails.phone;
        volunteerName = modalDetails.name;
        volunteerEmail = modalDetails.email;
      }

      if ($scope.project.gdd) {
        if (window.location.hostname == 'www.atadoslocal.com.br') {
          var api_gdd = 'http://127.0.0.1:8001';
        } else if(window.location.hostname == 'homolog.atados.com.br') {
          var api_gdd = 'https://api.homolog.global.good-deeds-day.org';
        } else {
          var api_gdd = 'https://api.global.good-deeds-day.org';
        }

        $http.post(api_gdd+'/projects/'+$scope.project.gdd_refer+'/applies/apply/', {phone: volunteerPhone, username: volunteerName, email: volunteerEmail})
        .success(function (response) {
          $location.path('/atado-dba');
        }).error(function(response) {
          alert('Este email já se encontra cadastrado nessa ação')
        });
        
        return false;
      }

      $http.post(api + 'apply_volunteer_to_project/', {project: $scope.project.id, message: volunteerMessage, phone: volunteerPhone, name: volunteerName, email: volunteerEmail})
      .success(function (response) {
        if (response[0] === 'Applied') {
          $scope.project.volunteers.push($scope.loggedUser);
          $scope.alreadyApplied = true;
          //toastr.success('Parabéns! Você é voluntário para ' + $scope.project.name);
          dataLayer.push({
            'event': 'okQueroSerVoluntarioButtonClick',
            'eventCategory': 'buttonClicked',
            'eventAction' : 'success'
          });
          $location.path('/atado');

        } else {
          $scope.project.volunteers.splice($scope.project.volunteers.indexOf($scope.loggedUser),1);
          $scope.alreadyApplied = false;
          toastr.success('Você não é mais voluntário para ' + $scope.project.name);
        }
      }).error(function (error) {
        console.error(error);
        if (error['403']) {
          $modal.open({
            template: '<div class="modal-body">' +
            '<p>Para ser voluntário, você precisar confirmar sua conta no Atados clicando no link que te mandamos por email quando você criou sua conta.</p>' +
            '<button class="btn btn-info" ng-click="ok()">Ok</button>' +
            '</div>',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
              $scope.ok = function () {
                $modalInstance.close();
              };
            }]
          });
        } else {
          toastr.error('Não conseguimos te candidatar. Por favor mande um email para resolvermos o problema: contato@atados.com.br');
        }
      });
    }, function () {
    });
  }
});
