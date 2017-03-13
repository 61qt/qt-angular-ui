import angular   from 'angular';
import Alert     from './src/alert';
import Calendar from './calendar';
import Toast     from './src/toast';

export default angular.module('qtAngularUi', [
  Alert,
  Calendar,
  Toast,
])
.name;
