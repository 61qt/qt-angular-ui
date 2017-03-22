import 'restangular';


import angular from 'angular';
import Config from './config';

export default angular.module('qtAngularUi.restangular', [
  'restangular',
  Config,
])
.name;
