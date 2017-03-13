import angular   from 'angular';
import toast     from './src/toast';
import alert     from './src/alert';

export default angular.module('qtAngularUi', [
  toast,
  alert,
])
.name;
