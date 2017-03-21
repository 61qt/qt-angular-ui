/**
 * angular.js@1.5.8 line: 23994
 *
 * 华为 Che2-TL00M EMUI 3.0 微信 6.3.22 版本
 * Chrome 37.0.0 版本下
 * 使用该机华为输入法输入中文情况下
 * 会出现第二个输入字符覆盖第一个输入字符
 * 因为 input event 不规范导致, 具体原因不明
 * 但在系统默认浏览器下不会出现该问题
 *
 * 因为如果删除 input 事件, keydown 还会导致值未更新情况,
 * 造成第一个值仍然保存, 但是并不能结合第二个值合并输入成中文
 * 因此还需要将 keydown 修改成 keyup 事件
 *
 * 因为 angular 使用 jQLit 的原因 而且 angular@1.5.8
 * line: 1881 行中外置该对象, 因此我们可以重写该方法, 将
 * 所有安卓在微信端的 input 事件, 都统一转成 keyup 事件
 */
import angular from 'angular';

let noComfilt = angular.element.prototype.on;
angular.element.prototype.on = function (event, callback, bind) {
  if ('input' === event && (angular.device.is('Android') || angular.device.is('BadAndroid')) && angular.device.is('WeChat')) {
    return noComfilt.call(this, 'keypress', callback, bind);
  }

  return noComfilt.call(this, event, callback, bind);
};


export default angular.module('qtAngularUi.coreOn', []).name;