import _       from 'lodash';
import angular from 'angular';

let uri = angular.parseUrl(document.location.href);
angular.loghub.configure({
  feedback: `${_.trimEnd(`${uri.scheme}://api.${uri.rootDomain}`, '/')}/front_log.php`,
});

export default angular.module('qtAngularUi.loghubConf', [])
.config(function ($provide) {
  'ngInject';

  /**
   * 捕捉所有错误
   * See:
   * https://docs.angularjs.org/api/ng/service/$exceptionHandler
   * https://gist.github.com/loicknuchel/fcf54e1e8d0bcaf60a6d
   */
  $provide.decorator('$exceptionHandler', function ($delegate) {
    'ngInject';

    function catchError (exception) {
      let record = angular.loghub.capture(exception, 'error');

      if (record) {
        true === angular.env.PRODUCT
        ? record.report()
        : record.print();
      }
    }

    window.onerror = function (message, url, line, col, error) {
      error && catchError(error);
    };

    return function (exception, cause) {
      $delegate(exception, cause);
      catchError(exception);
    };
  });
})
.name;
