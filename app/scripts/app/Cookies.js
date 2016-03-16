// factory
function Cookies () {
  'ngInject';
  return {
    get: function(name){
      return $.cookie(name);
    },

    getAll: function(){
      return $.cookie();
    },

    set: function(name, value, config){
      return $.cookie(name, value, config);
    },

    delete: function(name){
      return $.removeCookie(name);
    }
  };
};

export default Cookies;
