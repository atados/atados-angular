'use strict';

toastr.options.closeButton = true;

var app = angular.module('atadosApp');

app.controller('AppController', function($scope, $translate, Site) {
  $scope.changeLanguage = function (langKey) {
    $translate.uses(langKey);
  };

  // Uncomment this if you want to test a user profile
  // $scope.loggedUser = testUser;
  var testUser = { 
    name: 'Marjori Pomarole',
    email: 'marjoripomarole@gmail.com',
    username: 'marjoripomarole',
    type: 'NONPROFIT'
  };

  $scope.site = Site;
});

app.controller('LoginController', ['$scope', '$rootScope', '$location', 'Auth', function($scope, $rootScope, $location, Auth) {
  $scope.username = '';
  $scope.password = '';
  $scope.rememberme = false;

  $scope.login = function() {
    if ( !($scope.password && $scope.username)) {
      return;
    }

    Auth.login({
        username: $scope.username,
        password: $scope.password,
        rememberme: $scope.rememberme
      }, function (response) {
        toastr.error('Success on login ' + response);
        $location.path('/');
      }, function (error) {
        toastr.error('Failed to login ' + error);
      });
  };

  $scope.loginOauth = function (provider) {
    toastr.info('Trying login through ' + provider);
    //$location.path('/auth/' + provider)
  };

  $scope.forgotPassword = function () {
    console.log('You forgot password :(');
  };
}]);

app.controller('VolunteerSignupController', ['$scope', '$rootScope', '$location', 'Auth', function($scope, $rootScope, $location, Auth) {
  $scope.role = Auth.userRoles.volunteer;
  $scope.userRoles = Auth.userRoles;

  $scope.$watch('password + passwordConfirm', function() {
    $scope.passwordDoesNotMatch = $scope.password !== $scope.passwordConfirm;
  });
  $scope.signup = function () {

    console.log("This is working");
    Auth.signup({
        username: $scope.username,
        email: $scope.email,
        password: $scope.password,
        role: $scope.role
      },
      function () {
        $location.path('/');
      },
      function (error) {
        toastr.error('Error on volunteer signup ' + error);
      });
  };

  $scope.signupOauth = function (provider) {
    toastr.info('Trying signup through ' + provider);
  };
}]);

app.controller('NonprofitSignupController', ['$scope', '$rootScope', '$location', 'Auth', function($scope, $rootScope, $location, Auth) {
  $scope.role = Auth.userRoles.nonprofit;
  $scope.userRoles = Auth.userRoles;

  $scope.$watch('password + passwordConfirm', function() {
    $scope.passwordDoesNotMatch = $scope.password !== $scope.passwordConfirm;
  });
  $scope.signup = function () {

    console.log("This is working");
    Auth.signup({
        username: $scope.username,
        email: $scope.email,
        password: $scope.password,
        role: $scope.role
      },
      function () {
        $location.path('/');
      },
      function (error) {
        toastr.error('Error on nonprofit signup ' + error);
      });
  };
}]);
