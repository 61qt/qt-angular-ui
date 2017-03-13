import './index.scss';

import angular   from 'angular';
import Component from './component';
import Modal     from './modal';

export default angular.module('qtAngularUi.calendar', [])
.directive('calendar', Component)
.directive('calendarModal', Modal)
.name;
