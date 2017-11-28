if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG) {
  window.console.log('qt-angular-ui/src/cropper load');
}

import 'cropperjs/dist/cropper.min.css'
import './index.scss';

import component   from './_index';

export default component;