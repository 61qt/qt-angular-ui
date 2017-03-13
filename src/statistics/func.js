import angular from 'angular';

window._hmt = window._hmt || [];

let worker = document.createElement('script');
worker.id = 'baidu-statistics';
worker.src = 'https://hm.baidu.com/hm.js?48b4ba35cef3ce3617c5fcb33dfd6e3c';

let node = document.getElementsByTagName('script')[0];
node.parentNode.insertBefore(worker, node);

angular.collect = function (type) {
  type = (type || '').toUpperCase();

  if ('UA' === type) {
    return function (point, data) {
      window._hmt.push(['_trackEvent', point, data]);
    };
  }

  if ('PV' === type) {
    return function (url) {
      window._hmt.push(['_trackPageview', url]);
    };
  }

  if ('USR' === type) {
    return function (userId) {
      window._hmt.push(['_setAccount', userId]);
    };
  }

  return angular.noop;
};

export default angular.module('qtAngularUi.statisticsFunc', []);