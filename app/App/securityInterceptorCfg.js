import {
  accessTokenCookie,
  csrfCookie,
  sessionIdCookie
} from '/constants';

// config
function securityInterceptorCfg ($httpProvider, $cookieStoreProvider) {
  'ngInject';
  var $cookieStore = $cookieStoreProvider.$get();
  $httpProvider.interceptors.push(($location, $q) => {
    'ngInject';
    return (promise) => promise.then(
      ((res) => res),
      (res) => {
        // This is when the user is not logged in
        switch (res.status) {
          case 401:
            return $q.reject(res);
          break;
          case 403:
            $cookieStore.remove(accessTokenCookie);
            $cookieStore.remove(csrfCookie);
            $cookieStore.remove(sessionIdCookie);
            return $q.reject(res);
          break;
          default:
            return $q.reject(res);
          break;
        }
      }
    );
  });
};

export default securityInterceptorCfg;
