import angular      from 'angular';
import Spinner      from './component';

export default angular.module('qtAngularUi.spinner', [])
.directive('spinner', Spinner)
.name;
