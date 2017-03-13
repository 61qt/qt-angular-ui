import angular   from 'angular';
import Component from './component';

export default angular.module('qtAngularUi.tracker', [])
.directive('tracker', Component)
.name;
