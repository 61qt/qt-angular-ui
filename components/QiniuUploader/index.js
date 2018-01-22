'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Name = undefined;

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _qiniup = require('qiniup');

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _module = require('../../share/module');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Name = exports.Name = 'QtNgUi.QiniuUploader';
exports.default = Name;


if (!(0, _module.exists)(Name)) {
  var App = (0, _module.def)(Name, []);

  var Service = function Service() {
    this.settings = {};

    this.ResponseInterceptor = ['$q', 'response', function ($q, response) {
      var deferred = $q.defer();
      deferred.resolve(response);
      return deferred.promise;
    }];

    this.configure = function (options) {
      this.settings = (0, _defaultsDeep2.default)(options, this.settings);
    };

    this.setTokenGetter = function (getter) {
      if ((0, _isFunction2.default)(getter) || (0, _isArray2.default)(getter)) {
        this.TokenGetter = getter;
      }
    };

    this.setResponseInterceptor = function (interceptor) {
      if ((0, _isFunction2.default)(interceptor) || (0, _isArray2.default)(interceptor)) {
        this.ResponseInterceptor = interceptor;
      }
    };

    this.$get = ['$injector', function ($injector) {
      var _this = this;

      var options = {};

      if ((0, _isFunction2.default)(this.ResponseInterceptor) || (0, _isArray2.default)(this.ResponseInterceptor)) {
        options.responseInterceptor = function (options) {
          return $injector.invoke(_this.ResponseInterceptor, null, options);
        };
      }

      if ((0, _isFunction2.default)(this.TokenGetter) || (0, _isArray2.default)(this.TokenGetter)) {
        options.tokenGetter = function (callback) {
          return $injector.invoke(_this.TokenGetter, null, { callback: callback });
        };
      }

      return new _qiniup.Uploader(options);
    }];
  };

  var Link = ['$parse', '$timeout', function ($parse, $timeout) {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<label ng-transclude></label>',
      link: function link($scope, $element, $attrs) {
        var selectFn = $parse($attrs.ngFileSelect);

        var element = $element[0];
        if (element.tagName.toLowerCase() !== 'input' || $element.attr('type') && $element.attr('type').toLowerCase() !== 'file') {
          var fileElem = _angular2.default.element('<input type="file">');
          for (var i = 0, len = element.attributes.length; i < len; i++) {
            fileElem.attr(element.attributes[i].name, element.attributes[i].value);
          }

          if ($element.attr('data-multiple')) {
            fileElem.attr('multiple', 'true');
          }

          fileElem.css('top', 0).css('bottom', 0).css('left', 0).css('right', 0).css('width', '100%').css('opacity', 0).css('position', 'absolute').css('filter', 'alpha(opacity=0)');

          $element.append(fileElem);

          if ($element.css('position') === '' || $element.css('position') === 'static') {
            $element.css('position', 'relative');
          }

          $element = fileElem;
        }

        $element.bind('change', function (event) {
          var files = [];
          var fileList = event.__files__ || event.target.files;

          if (fileList !== null) {
            for (var _i = 0, _len = fileList.length; _i < _len; _i++) {
              files.push(fileList.item(_i));
            }
          }

          $timeout(function () {
            selectFn($scope, {
              $files: files,
              $event: event
            });

            $element.val('');
          });
        });
      }
    };
  }];

  App.provider('$qiniuUploader', Service);
  App.directive('qiniuUploader', Link);
}