// directive
export default function backgroundImg () {
  return function (scope, element, { backgroundImg: url = '' }) {
    element.css({
      'background-image': `url(${url})`,
      'background-size': 'cover'
    });
  };
}
