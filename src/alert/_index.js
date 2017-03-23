import angular   from 'angular';
import Component from './component';
import Service   from './service';

export default angular.module('qtAngularUi.alert', [])
.directive('alert', Component)
.provider('$alert', Service)
.run(($alert) => {
  if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG) {
    window.$$qtAngularUi = window.$$qtAngularUi || {};
    window.$$qtAngularUi.$alert = $alert;
  }
})
.config(($alertProvider) => {
  if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG) {
    window.$$qtAngularUi = window.$$qtAngularUi || {};
    window.$$qtAngularUi.$alertProvider = $alertProvider;
  }
})
.name;
