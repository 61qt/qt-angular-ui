import angular from 'angular';

export default angular.module('qtAngularUi.utilitybarConfExample', [])
.config(function ($utilitybarProvider) {
  'ngInject';

  $utilitybarProvider.configure({
    filterModules: [
      // 下面是 state 的名字
      'home',
      'home.index',
      'home_preview',
      'home.classes_filter',
      'user.home',
      'user.user.classes.attendance',
      'user.user.classes.entry',
      'user.user.classes.recent',
    ],
  });
})
.name;
