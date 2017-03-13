import angular   from 'angular';
import Alert     from './src/alert';
import Calendar from './calendar';
import Captcha  from './captcha';
import Locker from './locker',
import Switch from './switch';
import Toast     from './src/toast';

export default angular.module('qtAngularUi', [
  Alert,
  Calendar,
  Captcha,
  Locker,
  Switch,
  Toast,
])
.name;
