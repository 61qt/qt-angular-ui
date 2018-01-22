'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

require('blueimp-canvas-to-blob');

var _cropper = require('cropperjs/dist/cropper.min');

var _cropper2 = _interopRequireDefault(_cropper);

require('cropperjs/dist/cropper.min.css');

require('./stylesheet.scss');

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _module = require('../../share/module');

var _QiniuUploader = require('../QiniuUploader');

var _QiniuUploader2 = _interopRequireDefault(_QiniuUploader);

var _template = require('./template.pug');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.Cropper';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, [_QiniuUploader2.default]);

  var CropperImageLink = ['$rootScope', 'cropperInterceptor', function ($rootScope, cropperInterceptor) {
    return {
      restrict: 'A',
      require: '^cropper',
      scope: true,
      link: function link($scope, $element, $attrs, ctrl) {
        $element.on('load', function () {
          ctrl.setupCropper(this);
        });
      }
    };
  }];

  var CropperLinkController = ['$scope', 'cropperInterceptor', function ($scope, cropperInterceptor) {
    var _arguments = arguments,
        _this = this;

    $scope.cropperImage = '';
    $scope.$cropper = null;

    /**
     * 绑定更改大小重置图片剪切器大小
     */
    _angular2.default.element(window).on('resize', function () {
      if ($scope.$cropper) {
        $scope.$cropper.clear();
        $scope.$cropper.resize();
      }
    });

    /**
     * 读取文件数据
     * @param {File} file 文件
     * @param {Function} callback 回调
     */
    this.readDataByFile = function (file, callback) {
      if (!(0, _isFunction2.default)(callback)) {
        throw new Error('Cropper controller readImage: callback is not provided.');
      }

      var reader = new window.FileReader();
      reader.onload = function (event) {
        callback(null, event.target.result);
      };

      reader.onerror = function (error) {
        callback(error);
      };

      reader.readAsDataURL(file);
    };

    /**
     * 上传文件
     * @param  {File}     file     文件
     * @param  {Object}   options  配置
     * @param  {Function} callback 回调
     * @return {Promise}
     */
    this.upload = function (file, options, callback) {
      if (_arguments.length < 2) {
        return _this.upload(file, {}, options);
      }

      if (!(0, _isFunction2.default)(callback)) {
        throw new Error('Cropper controller upload: callback is not provided.');
      }

      cropperInterceptor.upload(file, options, callback);

      return {
        cancel: function cancel() {}
      };
    };

    /**
     * 获取图片 blob 数据
     * @param {Function} callback 回调
     */
    this.transformBlob = function (callback) {
      if (!(0, _isFunction2.default)(callback)) {
        throw new Error('Cropper controller transformBlob: callback is not provided.');
      }

      try {
        $scope.$cropper.getCroppedCanvas().toBlob(function (blob) {
          return callback(null, blob);
        });
      } catch (err) {
        callback(err);
      }
    };

    /**
     * 切片
     * @param  {String} image 图片数据
     */
    this.crop = function (image) {
      $scope.cropperImage = image;
    };

    /**
     * 初始化 cropper
     * @param {Element} element <img>/<canvas>
     * @param {Object}  options 配置
     */
    this.setupCropper = function (element, options) {
      $scope.$cropper && $scope.$cropper.destroy();
      $scope.$cropper = new _cropper2.default(element, (0, _defaultsDeep2.default)(options, $scope.options));
    };
  }];

  var CropperLink = ['$rootScope', 'cropperInterceptor', function ($rootScope, cropperInterceptor) {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      template: _template2.default,
      controller: CropperLinkController,
      require: ['^?ngModel', '^cropper'],
      scope: {
        model: '=?ngModel',
        cropperOptions: '=?cropperOptions'
      },
      link: function link($scope, $element, $attrs, ctrls) {
        var cropCtrl = ctrls[1];

        /**
         * https://github.com/fengyuanchen/cropperjs#options
         */
        $scope.options = (0, _defaultsDeep2.default)($scope.cropperOptions, {
          responsive: true,
          viewMode: 2,
          checkCrossOrigin: true,
          rotatable: true,
          aspectRatio: 1 / 1,
          minCropBoxWidth: 100,
          minCropBoxHeight: 100,
          minContainerWidth: 100,
          minContainerHeight: 100
        });

        $scope.openResult = !!$scope.model;
        $scope.fileSelected = false;
        $scope.loading = false;
        $scope.uploading = false;
        $scope.uploadProgress = 0;
        $scope.message = '点击与拽拉图片都能上传哦';

        /**
         * 选择文件并预览
         */
        $scope.onCropperFileSelect = function (_ref) {
          var _ref2 = (0, _slicedToArray3.default)(_ref, 1),
              file = _ref2[0];

          $scope.loading = true;

          cropCtrl.readDataByFile(file, function (error, data) {
            $scope.loading = false;

            if (error) {
              cropCtrl.upload(file, function (error) {
                if (error) {
                  notify(error, 'error');
                  $scope.cancel();
                  $scope.$digest();
                }
              });

              return;
            }

            cropCtrl.crop(data);
            $scope.openResult = false;
            $scope.fileSelected = true;
            $scope.$digest();
          });
        };

        /**
         * 上传
         */
        $scope.upload = function () {
          if ($scope.uploading === true) {
            return false;
          }

          $scope.$cropper.disable();
          $scope.uploading = true;
          $scope.uploadProgress = 0;

          cropCtrl.transformBlob(function (error, blob) {
            if (error) {
              notify(error, 'error');
              $scope.cancel();
              $scope.$digest();
              return;
            }

            cropCtrl.upload(blob, {
              onProgress: function onProgress(progress) {
                $scope.uploadProgress = progress;
              }
            }, function (error, data) {
              $scope.uploading = false;
              $scope.$cropper.enable();

              if (error) {
                notify(error, 'error');
                $scope.cancel();
                $scope.$digest();
                return;
              }

              var image = data.image;
              $scope.openResult = true;
              $scope.fileSelected = false;
              $scope.model = image;

              $rootScope.$digest();
            });
          });
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
          $scope.fileSelected = false;
          $scope.loading = false;
          $scope.uploading = false;
        };

        /**
         * 地址改变删除
         */
        $rootScope.$on('$stateChangeStart', $scope.cancel.bind($scope));

        function notify(type, message) {
          if (arguments.length < 2) {
            return notify('log', type);
          }

          (0, _isFunction2.default)(cropperInterceptor.notify) ? cropperInterceptor.notify(message, type) : console.log(message);
        }
      }
    };
  }];

  App.directive('cropperImage', CropperImageLink);
  App.directive('cropper', CropperLink);

  App.run(['$injector', function ($injector) {
    try {
      $injector.get('cropperInterceptor');
    } catch (error) {
      throw new Error('尚未进行 Cropper 的配置');
    }
  }]);
}