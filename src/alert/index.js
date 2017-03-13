import './alert.scss';

import angular   from 'angular';
import Component from './alert.component';
import Service   from './alert.service';

export default angular.module('component.alert', [])
.directive('alert', Component)
.provider('$alert', Service)
.name;
