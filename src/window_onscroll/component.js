export default function ($windowOnscroll) {
  'ngInject';

  return {
    restrict : 'A',
    replace  : false,
    link ($scope, $element, $attrs) {
      let startX    = $attrs.startX * 1 || 0;
      let endX      = $attrs.endX * 1 || 0;
      let startY    = $attrs.startY * 1 || 0;
      let endY      = $attrs.endY * 1 || 0;
      let className = $attrs.activeClass || 'active';

      let _scrollHandle = function () {
        let x = false;
        let y = false;

        if (0 === endX && startX <= window.scrollX) {
          x = true;
        }
        else if (0 < endX && startX < endX && startX <= window.scrollX && endX >= window.scrollX) {
          x = true;
        }
        else if (0 < endX && startX > endX && (startX <= window.scrollX || endX >= window.scrollX)) {
          x = true;
        }

        if (0 === endY && startY <= window.scrollY) {
          y = true;
        }
        else if (0 < endY && startY < endY && startY <= window.scrollY && endY >= window.scrollY) {
          y = true;
        }
        else if (0 < endY && startY > endY && (startY <= window.scrollY || endY >= window.scrollY)) {
          y = true;
        }

        if (true === x && true === y) {
          $element.addClass(className);
        }
        else {
          $element.removeClass(className);
        }
      };

      $windowOnscroll.bind($scope, _scrollHandle);
    },
  };
}