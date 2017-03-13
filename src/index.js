import angular   from 'angular';
import Alert     from './src/alert';
import Calendar from './calendar';
import Captcha  from './captcha';
import Checkbox from './checkbox';
import Cropper from './cropper';
import Lazier   from './lazier';
import Locker from './locker';
import Radio  from './radio';
import Spinner from './spinner';
import Switch from './switch';
import Toast     from './toast';
import Tracker from './tracker';
import Utilitybar from './utilitybar';
import Validator from './validator';

export default angular.module('qtAngularUi', [
  Alert,
  Calendar,
  Captcha,
  Checkbox,
  Cropper,
  Lazier,
  Locker,
  Radio,
  Spinner,
  Switch,
  Toast,
  Tracker,
  Utilitybar,
  Validator,
])
.name;
