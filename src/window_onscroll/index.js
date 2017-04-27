import angular   from 'angular';
import Component from './component';
import Service   from './service';

export default angular.module('qtAngularUi.windowOnscroll', [])
.directive('windowOnscroll', Component)
.factory('$windowOnscroll', Service)
.name;
