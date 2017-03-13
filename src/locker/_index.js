import angular   from 'angular';
import Service   from './service';
import Component from './component';

export default angular.module('qtAngularUi.locker', [])
.provider('$locker', Service)
.directive('locker', Component)
.name;
