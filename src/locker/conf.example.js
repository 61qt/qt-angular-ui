import angular   from 'angular';

export default angular.module('qtAngularUi.lockerConfExample', [])
/**
 * 处理页面通用事件
 * 1. 每次跳转的时候: spinner 自动弹出, 导航自动隐藏
 * 2. 当加载完成后 spinner 自动隐藏, 导航显示
 * 3. 跳转时候, 滚动条自动回到最上方
 */
.run(function ($rootScope, $state, $locker) {
  'ngInject';

  $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
    $locker.show('努力加载中');

    if (toState.redirectTo) {
      event.preventDefault();

      $state.go(toState.redirectTo, toParams, {
        location: 'replace',
      });
    }
  });

  $rootScope.$on('$viewContentLoaded', () => {
    $locker.hide();

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  });
})
.name;
