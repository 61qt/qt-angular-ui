/**
 * Cropper: https://github.com/fengyuanchen/cropperjs
 */
import _          from 'lodash';
import Template   from './index.jade';
import Controller from './controller';

export default function ($rootScope, cropperPromptInterceptor) {
  'ngInject';

  return {
    restrict   : 'EA',
    transclude : true,
    replace    : true,
    template   : Template,
    controller : Controller,
    require    : ['^?ngModel', '^cropper'],
    scope      : {
      model          : '=?ngModel',
      cropperOptions : '=?cropperOptions',
    },
    link ($scope, $element, $attrs, ctrls) {
      let cropCtrl = ctrls[1];

      /**
       * https://github.com/fengyuanchen/cropperjs#options
       */
      $scope.options = _.defaultsDeep($scope.cropperOptions, {
        responsive         : true,
        viewMode           : 2,
        checkCrossOrigin   : true,
        rotatable          : true,
        aspectRatio        : 1 / 1,
        minCropBoxWidth    : 100,
        minCropBoxHeight   : 100,
        minContainerWidth  : 100,
        minContainerHeight : 100,
      });

      $scope.openResult     = !!$scope.model;
      $scope.fileSelected   = false;
      $scope.loading        = false;
      $scope.uploading      = false;
      $scope.uploadProgress = 0;
      $scope.message        = '点击与拽拉图片都能上传哦';

      /**
       * 选择文件并预览
       */
      $scope.onCropperFileSelect = function ([file]) {
        $scope.loading = true;

        cropCtrl.readDataByFile(file, function (err, data) {
          $scope.loading = false;

          if (err) {
            cropCtrl.upload(file, function (err) {
              err && notify(err, 'error');
            });
          }
          else {
            cropCtrl.crop(data);

            $scope.openResult   = false;
            $scope.fileSelected = true;

            $scope.$digest();
          }
        });
      };

      /**
       * 上传
       */
      $scope.upload = function () {
        if (true === $scope.uploading) {
          return false;
        }

        $scope.$cropper.disable();

        $scope.uploading      = true;
        $scope.uploadProgress = 0;

        cropCtrl.transformBlob(function (err, blob) {
          if (err) {
            return;
          }

          cropCtrl.upload(blob, {
            onProgress (progress) {
              $scope.uploadProgress = progress;
            },
          },
          function (err, data) {
            let image = data.image;

            $scope.uploading = false;

            $scope.$cropper.enable();

            if (err) {
              notify(err, 'error');
              $scope.$cropper.crop();
            }
            else {
              $scope.openResult   = true;
              $scope.fileSelected = false;
              $scope.model        = image;
            }
          });
        });
      };

      /**
       * 取消
       */
      $scope.cancel = function () {
        $scope.fileSelected = false;
        $scope.loading      = false;
        $scope.uploading    = false;
      };

      /**
       * 地址改变删除
       */
      $rootScope.$on('$stateChangeStart', function () {
        $scope.cancel();
      });

      function notify (type, message) {
        if (2 > arguments.length) {
          return notify('log', type);
        }

        if (_.isFunction(cropperPromptInterceptor.notify)) {
          cropperPromptInterceptor.notify(message, type);
        }
        else {
          let trace = window.console ? window.console[type] : window.alert;
          _.isFunction(trace) && trace(message);
        }
      }
    },
  };
}
