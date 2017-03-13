import angular   from 'angular';
import Alert     from './src/alert';
import Calendar from './calendar';
import Captcha  from './captcha';
import Checkbox from './checkbox';
import Core from './core';
import Cropper from './cropper';
import Lazier   from './lazier';
import Locker from './locker';
import Loghub from './loghub';
import QiniuUploader from './qiniu_uploader';
import Radio  from './radio';
import Rem from './rem';
import Restangular from './restangular';
import Router from './router';
import Spinner from './spinner';
import Statistics from './statistics';
import Switch from './switch';
import Toast     from './toast';
import Tracker from './tracker';
import Utilitybar from './utilitybar';
import Validator from './validator';
import Wechat from './wechat';

export default angular.module('qtAngularUi', [
  Alert,
  Calendar,
  Captcha,
  Checkbox,
  Core,
  Cropper,
  Lazier,
  Locker,
  Loghub,
  QiniuUploader,
  Radio,
  Rem,
  Restangular,
  Router,
  Spinner,
  Statistics,
  Switch,
  Toast,
  Tracker,
  Utilitybar,
  Validator,
  Wechat,
])
.name;
