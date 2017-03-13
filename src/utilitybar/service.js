import _ from 'lodash';

export default class UtilitybarService {
  constructor () {
    let openScopes = [];
    let setting    = {
      filterModules: [],
    };

    this.configure = function (options) {
      setting = _.defaultsDeep(options, setting);
    };

    this.$get = function ($rootScope, $state) {
      'ngInject';

      let $utilitybar = {
        add (scope) {
          openScopes.push(scope);
          scope.$on('$destroy', () => {
            this.drop(scope);
          });
        },
        drop (scope) {
          _.pull(openScopes, scope);
          this.toggle(scope.isOpen);
        },
        toggle (isOpen) {
          let curScope = _.last(openScopes);
          curScope && curScope.toggle(!!isOpen);
        },
      };

      $rootScope.$on('$stateChangeStart', function () {
        $utilitybar.toggle(false);
      });

      $rootScope.$on('$viewContentLoaded', function () {
        let stateName = $state.current.name;
        $utilitybar.toggle(-1 === _.indexOf(setting.filterModules, stateName));
      });

      return $utilitybar;
    };
  }
}
