import _       from 'lodash';
import angular from 'angular';

export default angular.module('qtAngularUi.user', [])
.service('$user', function (localStorageService, jwtHelper, USER_JWT_TOKEN) {

  this._decodeToken = function (token) {
    try {
      return jwtHelper.decodeToken(token);
    }
    catch (err) {
      return undefined;
    }
  };

  this.checkToken = function (token = this.getToken()) {
    if (!token) {
      return false;
    }

    try {
      return !jwtHelper.isTokenExpired(token);
    }
    catch (err) {
      return false;
    }
  };

  this.getToken = function () {
    return localStorageService.cookie.get(USER_JWT_TOKEN);
  };

  this.setToken = function (token) {
    if (_.isString(token) && token && true === this.checkToken(token)) {
      localStorageService.cookie.set(USER_JWT_TOKEN, token);
      return true;
    }

    return false;
  };

  this.unsetToken = function () {
    localStorageService.cookie.remove(USER_JWT_TOKEN);
    return true;
  };

  this.get = function (query) {
    let token = this.getToken();
    if (!token) {
      return;
    }

    let auth = this._decodeToken(token);
    return _.get(auth, query);
  };

  this.checkAuth = function (token = this.getToken()) {
    if (!token) {
      return false;
    }

    let auth = this._decodeToken(token);
    return !!(auth && 0 < auth.id && this.checkToken(token));
  };

})
.name;
