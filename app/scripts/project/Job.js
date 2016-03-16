// factory
function Job ($http, $q, api) {
  'ngInject';
  return {
    get: function(id) {
      var deferred = $q.defer();
      $http.get(api + 'jobs/'+ id + '/').success(function (job) {
        deferred.resolve(job);
      });
      return deferred.promise;
    }
  };
};

export default Job;
