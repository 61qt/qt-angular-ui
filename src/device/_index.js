import _            from 'lodash';
import MobileDetect from 'mobile-detect';
import angular      from 'angular';

_.defaultsDeep(MobileDetect, {
  _impl: {
    mobileDetectRules: {
      props: {
        WeChat     : [/MicroMessenger\/([\d\.]+)/i],
        BadAndroid : [/Android /i],
      },
      uas: {
        WeChat     : /MicroMessenger\/([\d\.]+)/i,
        BadAndroid : /Android /i,
      },
    },
  },
});

angular.device = new MobileDetect(window.navigator.userAgent);

export default angular.module('qtAngularUi.devide', []).name;