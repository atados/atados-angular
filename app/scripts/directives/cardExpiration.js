// directive
export default function cardExpiration () {
  return {
    link: function($scope, element) {
      element.mask('99/9999');
    }
  };
}
