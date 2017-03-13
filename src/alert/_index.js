import angular   from 'angular';
import Component from './component';
import Service   from './service';

export default angular.module('qtAngularUi.alert', [])
.directive('alert', Component)
.provider('$alert', Service)
.name;
