import angular             from 'angular';
import SwitchComponent     from './component';
import OriginComponent     from './origin.component';
import TranscludeComponent from './transclude.component';

export default angular.module('qtAngularUi.switch', [])
.directive('switchTransclude', TranscludeComponent)
.directive('switchOrigin', OriginComponent)
.directive('switch', SwitchComponent)
.name;
