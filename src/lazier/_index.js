import angular   from 'angular';
import Component from './component';
import Service   from './service';

export default angular.module('qtAngularUi.lazier', [])
.provider('$lazier', Service)
.directive('lazier', Component)
.name;
