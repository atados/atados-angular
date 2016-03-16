// factory
function Work ($http, $q, api) {
  'ngInject';
  return {
    get: function(id) {
      var deferred = $q.defer();
      $http.get(api + 'works/'+ id + '/').success(function (work) {
        deferred.resolve(work);
      });
      return deferred.promise;
    }
  };
};

export default Work;
