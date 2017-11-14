import './index.scss';

import angular   from 'angular';
import Service   from './service';
import Component from './component';
import uiSpinner from '../spinner';

export default angular.module('qtAngularUi.locker', [uiSpinner])
.provider('$locker', Service)
.directive('locker', Component)
.name;
