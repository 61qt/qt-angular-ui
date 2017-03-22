import _ from 'lodash';
import angular        from 'angular';
import QiniuUploader from './class';

export default angular.module('qtAngularUi.qiniuUploader', [])
.provider('$qiniuUploader', function () {
  /**
   * 获取 token 函数
   */
  this.TokenGetter;

  /**
   * 回调函数
   */
  this.ResponseInterceptor = function ($q, response) {
    'ngInject';

    let deferred = $q.defer();
    deferred.resolve(response);
    return deferred.promise;
  };

  /**
   * 是否支持
   */
  this.supported = QiniuUploader.supported;

  /**
   * 配置
   */
  this.configure = function (options) {
    QiniuUploader.DEFAULTS = _.defaultsDeep(options, QiniuUploader.DEFAULTS);
  };

  /**
   * 设置获取 Qiniu Token 方法
   */
  this.setTokenGetter = function (getter) {
    if (angular.isFunction(getter) || angular.isArray(getter)) {
      this.TokenGetter = getter;
    }
  };

  /**
   * 设置回调
   */
  this.setResponseInterceptor = function (interceptor) {
    if (angular.isFunction(interceptor) || angular.isArray(interceptor)) {
      this.ResponseInterceptor = interceptor;
    }
  };

  this.$get = ($injector) => {
    'ngInject';

    let options = {};
    if (angular.isFunction(this.ResponseInterceptor) || angular.isArray(this.ResponseInterceptor)) {
      options.responseInterceptor = (options) => {
        return $injector.invoke(this.ResponseInterceptor, null, options);
      };
    }

    if (angular.isFunction(this.TokenGetter) || angular.isArray(this.TokenGetter)) {
      options.tokenGetter = (options) => {
        return $injector.invoke(this.TokenGetter, null, options);
      };
    }

    return new QiniuUploader(options);
  };
})
.directive('qiniuUploader', function ($parse, $timeout) {
  return {
    restrict   : 'EA',
    replace    : true,
    transclude : true,
    template   : '<label ng-transclude></label>',
    link ($scope, $element, $attrs) {
      let selectFn = $parse($attrs.ngFileSelect);

      let element = $element[0];
      if ('input' !== element.tagName.toLowerCase()
        || $element.attr('type')
        && 'file' !== $element.attr('type').toLowerCase()) {

        let fileElem = angular.element('<input type="file">');
        for (let i = 0, len = element.attributes.length; i < len; i ++) {
          fileElem.attr(element.attributes[i].name, element.attributes[i].value);
        }

        if ($element.attr('data-multiple')) {
          fileElem.attr('multiple', 'true');
        }

        fileElem
        .css('top', 0)
        .css('bottom', 0)
        .css('left', 0)
        .css('right', 0)
        .css('width', '100%')
        .css('opacity', 0)
        .css('position', 'absolute')
        .css('filter', 'alpha(opacity=0)');

        $element.append(fileElem);

        if ('' === $element.css('position') || 'static' === $element.css('position')) {
          $element.css('position', 'relative');
        }

        $element = fileElem;
      }

      $element.bind('change', (event) => {
        let files    = [];
        let fileList = event.__files__ || event.target.files;

        if (null !== fileList) {
          for (let i = 0, len = fileList.length; i < len; i ++) {
            files.push(fileList.item(i));
          }
        }

        $timeout(() => {
          selectFn($scope, {
            $files : files,
            $event : event,
          });

          $element.val('');
        });
      });
    },
  };
})
.name;
