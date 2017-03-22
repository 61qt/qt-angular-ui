import angular from 'angular';

export default angular.module('qtAngularUi.cropperConfExample', [])
.provider('cropperPromptInterceptor', function () {
  this.$get = function ($toast) {
    'ngInject';

    return {
      notify (message) {
        $toast.create(message);
      },
    };
  };
})
.name;
