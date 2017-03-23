import angular from 'angular';
import Component        from './component';

export default angular.module('qtAngularUi.page', [])
.provider('$page', Component)
.run(($injector) => {
  if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG) {
    try {
      $injector.get('pageInterceptor');
    }
    catch (e) {
      window.console.error('[qt-angular-ui]尚未进行 page 的配置，请查看 qt-angular-ui/src/page/README.md 进行配置');
    }
  }
})
.name;
