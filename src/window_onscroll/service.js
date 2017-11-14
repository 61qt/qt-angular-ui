import _       from 'lodash';
import angular from 'angular';

export default function ($window) {
  let _scrollHandles     = [];
  let _stopScrollHandles = [];

  let startScroll = function () {
    _scrollHandles     = _.concat(_scrollHandles, _stopScrollHandles);
    _stopScrollHandles = [];
  };

  let stopScroll = function () {
    _stopScrollHandles = _.concat(_scrollHandles, _stopScrollHandles);
    _scrollHandles     = [];
  };

  let remove = function (scrollHandle) {
    _.remove(_scrollHandles, function (n) {
      return scrollHandle === n;
    });
    _.remove(_stopScrollHandles, function (n) {
      return scrollHandle === n;
    });
  };

  let removeAll = function () {
    _scrollHandles     = [];
    _stopScrollHandles = [];
  };

  let onDestroy = function ($scope, scrollHandle) {
    $scope.$on('$destroy', () => {
      remove(scrollHandle);
    });
  };

  let _scrollHandle = function () {
    if (_.isEmpty(_scrollHandles)) {
      angular.element($window).off('scroll', _scrollHandle);
      return;
    }

    for (let i = 0, l = _scrollHandles.length; i < l; i ++) {
      let scrollHandle = _scrollHandles[i];

      if (_.isFunction(scrollHandle)) {
        let finished = scrollHandle();

        if (finished) {
          _scrollHandles.splice(i, 1);
          i --;
          l --;
        }
      }
    }
  };

  return {
    bind ($scope, scrollHandle) {
      if (!_.isFunction(scrollHandle)) {
        throw new Error('$windowOnscroll.bind($scope, scrollHandle); -> scrollHandle is not function');
      }

      _scrollHandles.push(scrollHandle);
      onDestroy($scope, scrollHandle);

      if (1 === _scrollHandles.length) {
        angular
        .element($window)
        .on('scroll', _scrollHandle)
        .triggerHandler('scroll');
      }
    },
    startScroll,
    stopScroll,
    remove,
    removeAll,
  };
}
