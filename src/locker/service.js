import _       from 'lodash';
import angular from 'angular';
import Config  from './config';

export default class LockerService {
  constructor () {
    let defaults = Config;

    this.configure = function (options) {
      defaults = _.defaultsDeep(options, defaults);
    };

    this.$get = function ($rootScope, $compile) {
      'ngInject';

      let $scope      = $rootScope.$new();
      let $component  = $compile('<locker></locker>')($scope);
      let $childScope = $component.children().scope();

      angular.element(document.body).append($component);

      return {
        show (options, callback) {
          $childScope.show(options, callback);
        },
        hide (options, callback) {
          $childScope.hide(options, callback);
        },
      };
    };
  }
}
