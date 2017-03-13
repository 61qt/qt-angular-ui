import angular   from 'angular';
import Alert     from './src/alert';
import Calendar from './calendar';
import Captcha  from './captcha';
import Checkbox from './checkbox';
import Locker from './locker';
import Radio  from './radio';
import Spinner from './spinner';
import Switch from './switch';
import Toast     from './src/toast';

export default angular.module('qtAngularUi', [
  Alert,
  Calendar,
  Captcha,
  Checkbox,
  Locker,
  Radio,
  Spinner,
  Switch,
  Toast,
])
.name;
