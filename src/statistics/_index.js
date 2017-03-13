import angular from 'angular';

export default angular.module('qtAngularUi.statistics', [])
.run(function ($rootScope, $location, $user) {
  'ngInject';

  /**
   * 记录PV
   */
  $rootScope.$on('$stateChangeSuccess', function () {
    angular.collect('PV')($location.$$path);
  });
})
.run(function ($user) {
  'ngInject';

  /**
   * 记录用户
   */
  let uid = $user.get('id');
  if ($user.checkAuth() && uid) {
    angular.collect('USR')(uid + '');
  }
})
.name;
