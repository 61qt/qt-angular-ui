import './index.scss';
import angular   from 'angular';
import Component from './component';
import Service   from './service';

export default angular.module('qtAngularUi.toast', [])
.directive('toast', Component)
.provider('$toast', Service)
.name;
