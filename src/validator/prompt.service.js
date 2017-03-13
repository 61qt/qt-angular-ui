import angular from 'angular';

export default function () {
  this.$get = function () {
    return {
      notify: angular.noop,
    };
  };
}
