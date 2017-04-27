import './index.scss';

import angular            from 'angular';
import Checkbox           from './component.js';
import CheckboxOrigin     from './origin.component.js';

export default angular.module('qtAngularUi.checkbox', [])
.directive('checkbox', Checkbox)
.directive('checkboxOrigin', CheckboxOrigin)
.name;
