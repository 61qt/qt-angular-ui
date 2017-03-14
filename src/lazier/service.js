import _       from 'lodash';
import angular from 'angular';
import imagePlaceholder from './image_placeholder';

export default function () {
  let defaults = {};
  defaults.placeholder = defaults.errorholder = imagePlaceholder;

  this.configure = function (options) {
    defaults = _.defaults(options, defaults);
  };

  this.$get = function () {
    let openScopes = [];

    angular
    .element(window)
    .on('scroll', () => {
      for (let i = 0, l = openScopes.length; i < l; i ++) {
        let ret = openScopes[i].onload(function (error, imageSrc, scope) {
          error && openScopes.push(scope);
        });

        if (ret) {
          openScopes.splice(i, 1);
          i --;
          l --;
        }
      }
    })
    .triggerHandler('scroll');

    return {
      defaults,
      bind ($scope) {
        openScopes.push($scope);
        angular.element(window).triggerHandler('scroll');
      },
    };
  };
}
