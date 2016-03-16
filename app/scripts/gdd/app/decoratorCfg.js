// config
function decoratorCfg ($provide) {
  'ngInject';
  $provide.decorator('$uiViewScroll', function ($delegate) {
    return function (uiViewElement) {
      var top = uiViewElement[0].getBoundingClientRect().top;
      window.scrollTo(0, (top - 30));
    };
  });
};

export default decoratorCfg;
