import _       from 'lodash';
import angular from 'angular';

export default function (validateInterceptor, validateAjaxInterceptor, validatorPromptInterceptor) {
  'ngInject';

  return {
    restrict: 'A',
    require: '^ngModel',
    scope: {
      value        : '=?ngModel',
      equalValue   : '=?equal',
      noEqualValue : '=?noequal',
    },
    link ($scope, $element, $attrs, ModelCtrl) {
      let validity       = ['required', 'equal', 'noequal', 'ajax'];
      let ngModel        = _.isEmpty($attrs.ngModel) ? undefined : $attrs.ngModel;
      let required       = _.isBoolean($attrs.required) ? $attrs.required : false;
      let equal          = _.isEmpty($attrs.equal) ? undefined : $attrs.equal;
      let noequal        = _.isEmpty($attrs.noequal) ? undefined : $attrs.noequal;
      let type           = _.isEmpty($attrs.ngType) ? undefined : $attrs.ngType;
      let notifyOptions  = _.isEmpty($attrs.vdNotify) ? '{}' : $attrs.vdNotify;

      let validateFn     = validateInterceptor[type];
      let validateAjaxFn = validateAjaxInterceptor[type];

      const UPDATE_DIRTY = `validator.dirty.${ngModel}`;
      const UPDATE_FOCUS = `validator.focus.${ngModel}`;

      try {
        /* eslint no-new-func: off */
        let fn = new Function(`return ${notifyOptions}`);
        notifyOptions = fn();
      }
      catch (err) {
        notifyOptions = {};
      }

      /**
       * 监听输入值修改
       * 这里监听类型主要使用 input 事件
       */
      ModelCtrl.$parsers
      .unshift((viewValue) => {
        $scope.$parent.$broadcast(UPDATE_DIRTY, true);

        /**
         * 遍历所有默认验证
         * 首先将所有值默认设置成 true
         * 因为可能有不使用某种验证 (该验证设为a) 的情况
         * 而 a 永远不为 true, 导致最终永远为错误
         */
        angular.forEach(validity, (name) => {
          ModelCtrl.$setValidity(name, true);
        });

        /**
         * 开始验证该值
         * 这里的验证只要不为 true 就是错误
         * 只有 true 才是验证正确
         */
        let valid = validate(viewValue);
        if (true !== valid) {
          /**
           * 某验证可能为自定义验证规则,
           * 因此这里需要判断一下若不存在
           * 判断规则里面自动添加至验证规则中
           */
          -1 === validity.indexOf(valid) && validity.push(valid);
          ModelCtrl.$setValidity(valid, false);
        }

        /**
         * 当某值输入错误的时候获取该值时永远都必须为 undefined
         * 但在设置 required 属性时该值为空字符串, 即表示正确
         */
        return true === valid ? viewValue : required ? '' : undefined;
      });

      $element
      .on('focus', () => {
        /**
         * 广播一下, 让 form 控制器知道当前验证指令为 focus
         */
        $scope.$parent.$broadcast(UPDATE_FOCUS, true);
      })
      .on('blur', () => {
        let valid = validate(ModelCtrl.$viewValue);

        /**
         * 开始通过 ajax 验证
         * 当普通验证正确时, 才能触发 ajax 验证
         * 当 ajax 错误的时候设置 ajax 标示为 false
         * 这里会导致延迟但是不会阻挡, 网速慢的用户正常提交
         */
        if (true === valid && angular.isFunction(validateAjaxFn)) {
          validateAjaxFn.call(validateInterceptor, ModelCtrl.$viewValue)
          .catch(() => {
            ModelCtrl.$setValidity('ajax', false);
          });
        }

        /**
         * 自定义提示
         */
        if (true !== valid) {
          validatorPromptInterceptor.notify(valid, notifyOptions, ModelCtrl.$viewValue, ModelCtrl, $scope);
        }

        /**
         * 也要广播一下, 重置 focus 属性
         */
        $scope.$parent.$broadcast(UPDATE_FOCUS, false);
      });

      /**
       * 因为多个相同的 ngModel，angular 会将最后的 ngModel 覆盖，而前面所有的
       * ngModel 均被保存在该 directive 中，对表单中的属性无任何影响作用，
       * 只有 value 和 $invalid 会同步 $dirty 等不会同步过来，
       * 因此这里使用广播使得多个 ngModel 对象相同
       */
      if (ngModel) {
        $scope.$on(UPDATE_DIRTY, (event, isDrity) => {
          isDrity = !!isDrity;
          isDrity !== ModelCtrl.$dirty && ModelCtrl.$setDirty(isDrity);
        });

        $scope.$on(UPDATE_FOCUS, (event, isFocus) => {
          isFocus = !!isFocus;

          if (isFocus !== ModelCtrl.$focus) {
            $scope.$apply(() => {
              ModelCtrl.$focus = isFocus;
            });
          }
        });
      }

      /**
       * "等于" 与 "不等于" 验证
       * 当出现 equalValue 或 noEqualValue 才会触发
       * 该事件
       */
      if (!_.isEmpty($scope.equalValue) || !_.isEmpty($scope.noEqualValue)) {
        $scope.$watch(function () {
          return [$scope.equalValue, $scope.noEqualValue].join(',');
        },
        function () {
          ModelCtrl.$validate();
        });
      }

      /**
       * 验证方法
       * 只要不为 true, 则表示错误
       * 只有为 true 的情况下才是正确的
       * 每种字符串表示错误的类型
       */
      function validate (value) {
        if (required && '' === value) {
          return 'required';
        }

        if (equal && value !== $scope.equalValue) {
          return 'equal';
        }

        if (noequal && value === $scope.noEqualValue) {
          return 'noequal';
        }

        if (!required && '' === value) {
          return true;
        }

        let valid;
        if (angular.isFunction(validateFn) && (valid = validateFn.call(validateInterceptor, value))) {
          return valid;
        }

        return true;
      }
    },
  };
}
