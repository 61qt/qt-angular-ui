import angular      from 'angular';
import Radio        from './component.js';
import RadioOrigin  from './origin.component.js';

export default angular.module('qtAngularUi.radio', [])
.directive('radio', Radio)
.directive('radioOrigin', RadioOrigin)
.name;
