import _ from 'lodash';
import angular from 'angular';

export default angular.module('qtAngularUi.pageConfExample', [])
.provider('pageInterceptor', function () {
  this.$get = function ($filter, IGNORE_QUERY_KEYWORDS) {
    'ngInject';

    return {
      imgUrl (image) {
        return $filter('qiniuImage')(image);
      },
      link (link) {
        let newLink = link;
        let uri    = angular.parseUrl(link);
        let params = angular.parseParameters(uri.query);

        if (!_.isEmpty(params)) {
          params = _.assign(params, _.zipObject(IGNORE_QUERY_KEYWORDS));

          let query = angular.stringifyParameters(params);
          newLink = query
            ? `${uri.scheme}://${uri.host}${uri.path}?${query}`
            : `${uri.scheme}://${uri.host}${uri.path}`;
        }
        return newLink;
      }
    };
  };
})
.name;
