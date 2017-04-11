import _       from 'lodash';
import angular from 'angular';
import Config  from './config';

export default class AlertService {
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

          let $alert    = angular.element(`<alert alert-options='alertOptions'>${message}</alert>`);
          let $newscope = $rootScope.$new();

          if (_.isPlainObject(options)) {
            $newscope.alertOptions = options;
          }

          let $element = $compile($alert)($newscope);
          let $scope   = angular.element($element[0].childNodes[0]).scope();
          angular.element(document.body).append($element);

          openScopes.push($scope);
        },
        removeAll () {
          _.forEach(openScopes, (scope) => {
            scope.dismiss();
          });
        },
      };
    };
  }
}
