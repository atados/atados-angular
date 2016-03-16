import {accessTokenCookie, csrfCookie, sessionIdCookie} from '../constants';

// config
function securityInterceptorCfg ($httpProvider) {
  'ngInject';
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
            $.removeCookie(accessTokenCookie);
            $.removeCookie(csrfCookie);
            $.removeCookie(sessionIdCookie);
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
