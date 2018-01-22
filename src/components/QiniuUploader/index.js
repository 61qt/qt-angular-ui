import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import defaultsDeep from 'lodash/defaultsDeep'
import { Uploader } from 'qiniup'
import angular from 'angular'
import { exists as ngExistsModule, def as ngModule } from '../../share/module'

export const Name = 'QtNgUi.QiniuUploader'
export default Name

if (!ngExistsModule(Name)) {
  const App = ngModule(Name, [])

  const Service = function () {
    this.settings = {}

    this.ResponseInterceptor = [
      '$q', 'response',
      function ($q, response) {
        let deferred = $q.defer()
        deferred.resolve(response)
        return deferred.promise
      }
    ]

    this.configure = function (options) {
      this.settings = defaultsDeep(options, this.settings)
    }

    this.setTokenGetter = function (getter) {
      if (isFunction(getter) || isArray(getter)) {
        this.TokenGetter = getter
      }
    }

    this.setResponseInterceptor = function (interceptor) {
      if (isFunction(interceptor) || isArray(interceptor)) {
        this.ResponseInterceptor = interceptor
      }
    }

    this.$get = [
      '$injector',
      function ($injector) {
        let options = {}

        if (isFunction(this.ResponseInterceptor) || isArray(this.ResponseInterceptor)) {
          options.responseInterceptor = (options) => $injector.invoke(this.ResponseInterceptor, null, options)
        }

        if (isFunction(this.TokenGetter) || isArray(this.TokenGetter)) {
          options.tokenGetter = (callback) => $injector.invoke(this.TokenGetter, null, { callback })
        }

        return new Uploader(options)
      }
    ]
  }

  const Link = [
    '$parse', '$timeout',
    function ($parse, $timeout) {
      return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<label ng-transclude></label>',
        link ($scope, $element, $attrs) {
          let selectFn = $parse($attrs.ngFileSelect)

          let element = $element[0]
          if (element.tagName.toLowerCase() !== 'input' ||
            ($element.attr('type') && $element.attr('type').toLowerCase() !== 'file')) {
            let fileElem = angular.element('<input type="file">')
            for (let i = 0, len = element.attributes.length; i < len; i++) {
              fileElem.attr(element.attributes[i].name, element.attributes[i].value)
            }

            if ($element.attr('data-multiple')) {
              fileElem.attr('multiple', 'true')
            }

            fileElem
              .css('top', 0)
              .css('bottom', 0)
              .css('left', 0)
              .css('right', 0)
              .css('width', '100%')
              .css('opacity', 0)
              .css('position', 'absolute')
              .css('filter', 'alpha(opacity=0)')

            $element.append(fileElem)

            if ($element.css('position') === '' || $element.css('position') === 'static') {
              $element.css('position', 'relative')
            }

            $element = fileElem
          }

          $element.bind('change', (event) => {
            let files = []
            let fileList = event.__files__ || event.target.files

            if (fileList !== null) {
              for (let i = 0, len = fileList.length; i < len; i++) {
                files.push(fileList.item(i))
              }
            }

            $timeout(() => {
              selectFn($scope, {
                $files: files,
                $event: event
              })

              $element.val('')
            })
          })
        }
      }
    }
  ]

  App.provider('$qiniuUploader', Service)
  App.directive('qiniuUploader', Link)
}
