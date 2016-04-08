import angular from 'angular';
import app from '/app';

if (!angular.element(document).scope() && !!app) {
  angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name]);
  });
}
