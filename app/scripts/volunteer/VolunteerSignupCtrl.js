// controller
function VolunteerSignupCtrl ($scope, $rootScope, $state, Auth, Restangular) {
  'ngInject';
  $scope.cityLoaded = false;
  $scope.$watch('state', function (value) {
    $scope.cityLoaded = false;
    $scope.stateCities = [];

    if (value) {
      Restangular.all('cities').getList({page_size: 3000, state: value.id}).then(function (response) {
        response.forEach(function(c) {
          $scope.stateCities.push(c);
        });

        value.citiesLoaded = true;
        $scope.cityLoaded = true;
      });
    }
  });

  $scope.$watch('email', function (value) {
    if (value) {
      Auth.isEmailUsed(value, function (response) {
        $scope.signupForm.email.alreadyUsed = response.alreadyUsed;
        $scope.signupForm.email.$invalid = response.alreadyUsed;
      });
    } else {
      $scope.signupForm.email.alreadyUsed = false;
    }
  });

  $scope.$watch('password + passwordConfirm', function() {
    $scope.passwordDoesNotMatch = $scope.password !== $scope.passwordConfirm;
  });

  $scope.signup = function () {
    dataLayer.push({
      'event': 'criarConta',
      'eventCategory': 'buttonClicked',
      'eventAction' : 'success'
    });

    if ($scope.signupForm.$valid) {
      var data = {
        email: $scope.email,
        password: $scope.password,
        address: {'city': $scope.city.id},
      };
      if ($state.current.name.split('.')[0] === 'gdd') {
        data.gdd = true;
      }
      Auth.volunteerSignup(data,
        function () {
          Auth.login({
            username: $scope.email,
            password: $scope.password,
            remember: $scope.remember
          }, function (response) {
            Auth.getCurrentUser(response.access_token).then(
              function (user) {
                $rootScope.$emit('userLoggedIn', user);
              }, function (error) {
                toastr.error(error);
              });
          }, function () {
            $scope.error = 'Usuário ou senha estão errados :(';
          });
        },
        function (error) {
          console.error(error);
          toastr.error('Não conseguimos criar sua conta agora. :(');
        });
    }
  };
};

export default VolunteerSignupCtrl;
