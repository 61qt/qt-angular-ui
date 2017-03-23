import _       from 'lodash';
import angular from 'angular';
import Cropper from 'cropperjs/dist/cropper.min';

export default class CropperController {
  constructor ($scope, cropperPromptInterceptor) {
    'ngInject';

    $scope.cropperImage;
    $scope.$cropper;

    /**
     * 读取文件数据
     * @param {File}     file     文件
     * @param {Function} callback 回调
     */
    this.readDataByFile = function (file, callback) {
      if (!_.isFunction(callback)) {
        throw new Error('CropperController.readImage: callback is not provided.');
      }

      let reader = new FileReader();
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
      if (3 > arguments.length) {
        return this.upload(file, {}, options);
      }

      if (!_.isFunction(callback)) {
        throw new Error('CropperController.upload: callback is not provided.');
      }

      cropperPromptInterceptor.upload(file, options, callback);

      return {
        cancel () {
        },
      };
    };

    /**
     * 获取图片 blob 数据
     * @param {Function} callback 回调
     */
    this.transformBlob = function (callback) {
      if (!_.isFunction(callback)) {
        throw new Error('CropperController.transformBlob: callback is not provided.');
      }

      try {
        $scope.$cropper
        .getCroppedCanvas()
        .toBlob((blob) => {
          callback(null, blob);
        });
      }
      catch (err) {
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
      !_.isUndefined($scope.$cropper) && $scope.$cropper.destroy();
      $scope.$cropper = new Cropper(element, _.defaultsDeep(options, $scope.options));
    };

    /**
     * 绑定更改大小重置图片剪切器大小
     */
    angular
    .element(window)
    .on('resize', () => {
      if ($scope.$cropper) {
        $scope.$cropper.clear();
        $scope.$cropper.resize();
      }
    });
  }
}