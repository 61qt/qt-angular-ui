'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = function (element, callback, duration) {
  if (!element) {
    throw new TypeError('You need to pass an element as parameter');
  }

  element = element instanceof _angular2.default.element || (0, _isArray2.default)(element) || element.length ? element[0] : element;

  var instance = Cache.insert(element);
  (0, _isFunction2.default)(callback) && instance.one(callback, duration);

  instance.remove = function () {
    return Cache.remove(element);
  };

  return instance;
};

var _indexOf = require('lodash/indexOf');

var _indexOf2 = _interopRequireDefault(_indexOf);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TransitionEnd = function () {
  function TransitionEnd(element) {
    (0, _classCallCheck3.default)(this, TransitionEnd);

    this.element = element;
    this.transitionEnd = this.whichTransitionEnd();
    this.callbacks = [];
  }

  (0, _createClass3.default)(TransitionEnd, [{
    key: 'whichTransitionEnd',
    value: function whichTransitionEnd() {
      var transitions = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd otransitionend',
        'transition': 'transitionend'
      };

      for (var t in transitions) {
        if (this.element.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }, {
    key: 'one',
    value: function one(callback, duration) {
      var _this = this;

      this.callbacks.push(callback);

      var $element = _angular2.default.element(this.element);

      $element.one(this.transitionEnd, callback).one(this.transitionEnd, function () {
        _this.tid && clearTimeout(_this.tid);
      });

      if (duration > 0) {
        this.tid = setTimeout(function () {
          return $element.triggerHandler(_this.transitionEnd);
        }, duration);
      }
    }
  }, {
    key: 'on',
    value: function on(callback) {
      this.callbacks.push(callback);
      _angular2.default.element(this.element).on(this.transitionEnd, callback);
    }
  }, {
    key: 'off',
    value: function off(callback) {
      var index = (0, _indexOf2.default)(this.callbacks, callback);
      index !== -1 && this.callbacks.splice(index, 1);
      _angular2.default.element(this.element).off(this.transitionEnd, callback);
    }
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      var _this2 = this;

      (0, _forEach2.default)(this.callbacks, function (callback) {
        _angular2.default.element(_this2.element).off(_this2.transitionEnd, callback);
      });

      this.callbacks.splice(0);
    }
  }]);
  return TransitionEnd;
}();

var Cache = {
  list: [],
  getPosition: function getPosition(element) {
    return (0, _indexOf2.default)(this.list, element);
  },
  insert: function insert(element) {
    var positonElement = this.getPosition(element);

    if (positonElement === -1) {
      var instance = new TransitionEnd(element);

      this.list.push(element);
      this.list.push(instance);

      return instance;
    }

    return this.list[positonElement + 1];
  },
  remove: function remove(element) {
    var positonElement = this.getPosition(element);

    if (positonElement !== -1) {
      // eslint-disable-next-line no-unused-vars
      var _list$splice = this.list.splice(positonElement, 2),
          _list$splice2 = (0, _slicedToArray3.default)(_list$splice, 2),
          _ = _list$splice2[0],
          instance = _list$splice2[1];

      instance.removeAllListeners();
    }
  }
};