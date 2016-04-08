// controller
function LoginCtrl ($scope, $rootScope, $state, Auth, ezfb, toastr) {
  'ngInject';
  $scope.showForgotPassword = false;
  $scope.remember = true;
  $scope.wrongCredentials = false;

  $scope.$watch('forgotEmail', function (value) {
    if (value) {
      Auth.isEmailUsed(value, function (response) {
        $scope.resetPasswordForm.forgotEmail.alreadyUsed = response.alreadyUsed;
        $scope.resetPasswordForm.forgotEmail.$invalid = !response.alreadyUsed;
      });
    } else {
      $scope.resetPasswordForm.forgotEmail.$invalid = true;
    }
  });

  $scope.login = function() {
    if (!($scope.password && $scope.email)) {
      return;
    }

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
      $scope.wrongCredentials = true;
    });
  };

  $scope.forgotPassword = function () {
    $scope.showForgotPassword = !$scope.showForgotPassword;
  };

  $scope.resetPassword = function () {
    Auth.resetPassword($scope.forgotEmail,  function () {
      toastr.info('Agora veja seu email para receber sua nova senha. Depois você pode mudar para uma senha da sua preferência.');
    }, function () {
      toastr.error('Sua senha não pode ser enviada. Por favor mande um email para contato@atados.com.br');
    });
  };

  function sendFacebookCredentials(authResponse) {
    Auth.facebookAuth(authResponse,
      function (user) {
        $rootScope.$emit('userLoggedIn', user);
      }, function () {
        toastr.error('Houve um error no servidor tentando logar com sua conta no Facebook.');
      });
  }

  $rootScope.facebookAuth = function () {
    if (!$scope.loginStatus) {
      toastr.error('Facebook bloqueado nesta conexão.');
      return;
    }

    if ($scope.loginStatus.status !== 'connected') {
      ezfb.login(function(loginResponse) {
        if (loginResponse.status === 'connected') {
          sendFacebookCredentials(loginResponse.authResponse);
        } else if ($scope.loginStatus.status === 'not_authorized') {
          // Here now user needs to authorize the app to be used with Facebook
        }
      }, {scope: 'email'});
    } else {
      if ($scope.loginStatus.authResponse) {
        sendFacebookCredentials($scope.loginStatus.authResponse);
      } else {
        toastr.error('Não conseguimos acessar dados do Facebook.');
      }
    }
  };

  ezfb.getLoginStatus(function (res) {
    $scope.loginStatus = res;
  });
};

export default LoginCtrl;
