import angular from 'angular';

export default angular.module('qtAngularUi.rem', [])
/**
 * 自适应放大, 根据页面大小
 * 自动修改 root 元素的 font-size 大小
 * 从而适配放大缩小不同的设备与浏览器
 */
.run(function () {
  /**
   * 设计图大小
   * iphone 6
   * root font size is 16px
   */
  const originWidthByDesign = 750 / 2;
  const originRootFontSize  = 16;
  const maxLimitWidth       = 667;

  let doc = document.documentElement;

  /**
   * 不支持 addEventListener 则退出
   */
  if (!document.addEventListener) {
    return;
  }

  /**
   * 随便创建一个 div 并赋予 1rem 的字体大小
   * 如果不支持 rem, 它的值不会等于 1rem的
   * 因此可以简单检测出当前浏览器是否支持 rem
   */
  let div = document.createElement('div');
  div.setAttribute('style', 'font-size: 1rem');

  /**
   * 如果不支持 rem 则不做任何操作
   */
  if ('1rem' !== div.style.fontSize) {
    return;
  }

  function reCalculate () {
    let clientWidth = doc.clientWidth;
    if (!clientWidth) {
      return;
    }

    clientWidth        = clientWidth < maxLimitWidth ? clientWidth : maxLimitWidth;
    doc.style.fontSize = `${originRootFontSize * clientWidth / originWidthByDesign}px`;
    doc.style.display  = 'none';

    // Force rerender - important to new Android devices
    doc.clientWidth;
    doc.style.display  = '';
  }

  /**
   * 重置大小与 ready 的时候触发
   * 一下 root element 的 font-size 大小计算
   */
  window.addEventListener('resize', reCalculate, false);
  document.addEventListener('DOMContentLoaded', reCalculate, false);

  reCalculate();
})
.name;
