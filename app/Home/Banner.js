// factory
function Banner (Restangular, toastr) {
  'ngInject';
  return {
    get: function () {
      return Restangular.all('banners')
      .getList()
      .then(function (res) {
        return res;
      }, function () {
        toastr.error('Não encontrei os banners :\'( ...');
      });
    }
  };
};

export default Banner;
