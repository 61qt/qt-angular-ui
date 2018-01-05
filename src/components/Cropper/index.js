import 'blueimp-canvas-to-blob'
import Cropper from 'cropperjs/dist/cropper.min'
import 'cropperjs/dist/cropper.min.css'

import './stylesheet.scss'

import isFunction from 'lodash/isFunction'
import defaultsDeep from 'lodash/defaultsDeep'
import angular from 'angular'
import Template from './template.pug'

const App = angular.module('QtNgUi.Cropper', [])

const CropperImageLink = ($rootScope, cropperInterceptor) => ({
  restrict: 'A',
  require: '^cropper',
  scope: true,
  link ($scope, $element, $attrs, ctrl) {
    $element.on('load', function () {
      ctrl.setupCropper(this)
    })
  }
})

const CropperLinkController = ($scope, cropperInterceptor) => {
  $scope.cropperImage = ''
  $scope.$cropper = null

  /**
   * 绑定更改大小重置图片剪切器大小
   */
  angular.element(window).on('resize', () => {
    if ($scope.$cropper) {
      $scope.$cropper.clear()
      $scope.$cropper.resize()
    }
  })

  /**
   * 读取文件数据
   * @param {File} file 文件
   * @param {Function} callback 回调
   */
  this.readDataByFile = (file, callback) => {
    if (!isFunction(callback)) {
      throw new Error('Cropper controller readImage: callback is not provided.')
    }

    let reader = new window.FileReader()
    reader.onload = function (event) {
      callback(null, event.target.result)
    }

    reader.onerror = function (error) {
      callback(error)
    }

    reader.readAsDataURL(file)
  }

  /**
   * 上传文件
   * @param  {File}     file     文件
   * @param  {Object}   options  配置
   * @param  {Function} callback 回调
   * @return {Promise}
   */
  this.upload = (file, options, callback) => {
    if (arguments.length < 2) {
      return this.upload(file, {}, options)
    }

    if (!isFunction(callback)) {
      throw new Error('Cropper controller upload: callback is not provided.')
    }

    cropperInterceptor.upload(file, options, callback)

    return {
      cancel () {
      }
    }
  }

  /**
   * 获取图片 blob 数据
   * @param {Function} callback 回调
   */
  this.transformBlob = (callback) => {
    if (!isFunction(callback)) {
      throw new Error('Cropper controller transformBlob: callback is not provided.')
    }

    try {
      $scope.$cropper.getCroppedCanvas().toBlob((blob) => callback(null, blob))
    } catch (err) {
      callback(err)
    }
  }

  /**
   * 切片
   * @param  {String} image 图片数据
   */
  this.crop = (image) => {
    $scope.cropperImage = image
  }

  /**
   * 初始化 cropper
   * @param {Element} element <img>/<canvas>
   * @param {Object}  options 配置
   */
  this.setupCropper = (element, options) => {
    $scope.$cropper && $scope.$cropper.destroy()
    $scope.$cropper = new Cropper(element, defaultsDeep(options, $scope.options))
  }
}

const CropperLink = ($rootScope, cropperInterceptor) => ({
  restrict: 'EA',
  transclude: true,
  replace: true,
  template: Template,
  controller: CropperLinkController,
  require: ['^?ngModel', '^cropper'],
  scope: {
    model: '=?ngModel',
    cropperOptions: '=?cropperOptions'
  },
  link ($scope, $element, $attrs, ctrls) {
    let cropCtrl = ctrls[1]

    /**
     * https://github.com/fengyuanchen/cropperjs#options
     */
    $scope.options = defaultsDeep($scope.cropperOptions, {
      responsive: true,
      viewMode: 2,
      checkCrossOrigin: true,
      rotatable: true,
      aspectRatio: 1 / 1,
      minCropBoxWidth: 100,
      minCropBoxHeight: 100,
      minContainerWidth: 100,
      minContainerHeight: 100
    })

    $scope.openResult = !!$scope.model
    $scope.fileSelected = false
    $scope.loading = false
    $scope.uploading = false
    $scope.uploadProgress = 0
    $scope.message = '点击与拽拉图片都能上传哦'

    /**
     * 选择文件并预览
     */
    $scope.onCropperFileSelect = function ([file]) {
      $scope.loading = true

      cropCtrl.readDataByFile(file, function (err, data) {
        $scope.loading = false

        if (err) {
          cropCtrl.upload(file, function (err) {
            err && notify(err, 'error')
          })

          return
        }

        cropCtrl.crop(data)
        $scope.openResult = false
        $scope.fileSelected = true
        $scope.$digest()
      })
    }

    /**
     * 上传
     */
    $scope.upload = function () {
      if ($scope.uploading === true) {
        return false
      }

      $scope.$cropper.disable()
      $scope.uploading = true
      $scope.uploadProgress = 0

      cropCtrl.transformBlob(function (error, blob) {
        if (error) {
          return
        }

        cropCtrl.upload(blob, {
          onProgress (progress) {
            $scope.uploadProgress = progress
          }
        }, function (error, data) {
          $scope.uploading = false
          $scope.$cropper.enable()

          if (error) {
            notify(error, 'error')
            $scope.$cropper.crop()
            return
          }

          let image = data.image
          $scope.openResult = true
          $scope.fileSelected = false
          $scope.model = image

          $rootScope.$digest()
        })
      })
    }

    /**
     * 取消
     */
    $scope.cancel = function () {
      $scope.fileSelected = false
      $scope.loading = false
      $scope.uploading = false
    }

    /**
     * 地址改变删除
     */
    $rootScope.$on('$stateChangeStart', $scope.cancel.bind($scope))

    function notify (type, message) {
      if (arguments.length < 2) {
        return notify('log', type)
      }

      isFunction(cropperInterceptor.notify)
        ? cropperInterceptor.notify(message, type)
        : console.log(message)
    }
  }
})

App.directive('cropperImage', CropperImageLink)
App.directive('cropper', CropperLink)

App.run(function ($injector) {
  try {
    $injector.get('cropperInterceptor')
  } catch (error) {
    throw new Error('尚未进行 Cropper 的配置')
  }
})

export default App.name
