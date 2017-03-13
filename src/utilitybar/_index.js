import angular    from 'angular';
import Utilitybar from './component';
import Transclude from './transclude.component';
import Service    from './service';

export default angular.module('qtAngularUi.utilitybar', [])
.directive('utilitybar', Utilitybar)
.directive('utilitybarTransclude', Transclude)
.provider('$utilitybar', Service)
.name;
