import angular from 'angular';

export default angular.module('qtAngularUi.cropperConfExample', [])
.provider('cropperPromptInterceptor', function () {
  this.$get = function ($toast, $qiniuUploader) {
    'ngInject';

    return {
      notify (message) {
        $toast.create(message);
      },
      upload (file, options, callback) {
        return $qiniuUploader
        .uploadImage(file, options)
        .then((data) => {
          callback(null, data);
        })
        .catch((error) => {
          callback(error);
        });
      }
    };
  };
})
.name;
