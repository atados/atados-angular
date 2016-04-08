// factory
function authInterceptorSvc ($q, $window, $injector, $cookieStore) {
  'ngInject';
  var responseError = function (rejection) {
    if (rejection.status === 403) {
      if (rejection.data.detail === 'Invalid token') {
        var $http = $injector.get('$http');

        $cookieStore.remove('access_token');
        delete $http.defaults.headers.common.Authorization;

        var current_location = $window.location.pathname;
        $window.location.href = '/#session-expired';

        // If the user is at the home, we need to force the reload
        if (current_location === '/') {
          $window.location.reload();
        }

        return {};
      }
    }

    return $q.reject(rejection);
  };

  return {
    responseError: responseError
  };
};

export default authInterceptorSvc;
