import _       from 'lodash';
import angular from 'angular';
import Config  from './config';

export default class toastService {
  constructor () {
    let openScopes = [];
    let defaults   = Config;

    this.configure = function (options) {
      defaults = _.assign(Config, options);
    };

    this.$get = function ($rootScope, $compile) {
      'ngInject';

      return {
        create (message, options = defaults) {
          if (_.isString(options)) {
            return this.create(message, { type: options });
          }

          let $toast = angular.element(`<toast>${message}</toast>`);
          let $scope = $rootScope.$new();

          if (_.isPlainObject(options)) {
            $scope.toastOptions = options;
          }

          let $element = $compile($toast)($scope);
          angular.element(document.body).append($element);

          openScopes.push($scope);
        },
        removeAll () {
          _.forEach(openScopes, (scope) => {
            scope.hide();
          });
        },
      };
    };
  }
}
