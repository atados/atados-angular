// factory
function Question ($http, $state, Restangular, Cleanup, api) {
  'ngInject';
  return {
    getAll: function() {
      return $http.get(api + 'questions/');
    }
  };
};

export default Question;
