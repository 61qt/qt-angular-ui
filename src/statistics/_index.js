import angular from 'angular';
import func from './func';

export default angular.module('qtAngularUi.statistics', [
  func,
])
.run(function ($rootScope, $location) {
  'ngInject';

  /**
   * 记录PV
   */
  $rootScope.$on('$stateChangeSuccess', function () {
    angular.collect('PV')($location.$$path);
  });
})
// .run(function ($user) {
//   'ngInject';

//   /**
//    * 记录用户
//    */
//   let uid = $user.get('id');
//   if ($user.checkAuth() && uid) {
//     angular.collect('USR')(uid + '');
//   }
// })
.name;
