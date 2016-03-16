// filter
function newlines ($sce) {
  'ngInject';
  return function(text) {
    if (text) {
      return $sce.trustAsHtml(text.replace(/\n/g, '<br/>'));
    }
  };
};

export default newlines;
