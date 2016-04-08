import angular from 'angular';
import newlinesFilter from './newlinesFilter';

const app = angular.module('atados.Filters', []);

app.filter('newlines', newlinesFilter);

export default app;
