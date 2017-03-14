import angular from 'angular';

/* eslint no-undef:0 */
angular.env = {
  DEVELOP : 'undefined' === typeof __DEVELOP__ ? false : !!__DEVELOP__,
  PRODUCT : 'undefined' === typeof __PRODUCT__ ? false : !!__PRODUCT__,
  UNITEST : 'undefined' === typeof __UNITEST__ ? false : !!__UNITEST__,
};
