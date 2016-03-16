// filter
function noHTML () {
  'ngInject';
  return function(text) {
    if (text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;');
    }
  };
};

export default noHTML;
