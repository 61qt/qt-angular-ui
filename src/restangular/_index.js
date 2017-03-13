import 'restangular';


import angular from 'angular';
import Conf from './conf';

export default angular.module('qtAngularUi.restangular', [
  'restangular',
  Conf,
])
.name;
