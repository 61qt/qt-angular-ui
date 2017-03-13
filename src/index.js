import angular   from 'angular';
import Alert     from './src/alert';
import Calendar from './calendar';
import Captcha  from './captcha';
import Checkbox from './checkbox';
import Lazier   from './lazier';
import Locker from './locker';
import Radio  from './radio';
import Spinner from './spinner';
import Switch from './switch';
import Toast     from './src/toast';
import Tracker from './tracker';
import Validator from './validator';

export default angular.module('qtAngularUi', [
  Alert,
  Calendar,
  Captcha,
  Checkbox,
  Lazier,
  Locker,
  Radio,
  Spinner,
  Switch,
  Toast,
  Tracker,
  Validator,
])
.name;
