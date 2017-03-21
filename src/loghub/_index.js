import _            from 'lodash';
import MobileDetect from 'mobile-detect';
import angular      from 'angular';
import Conf from './conf';

const device = new MobileDetect(window.navigator.userAgent);

/**
 * 事件通知类
 */
class Emitter {
  static EVENT_TYPES = [];

  constructor () {
    this.events = {};
  }

  support (type) {
    return -1 !== _.indexOf(Emitter.EVENT_TYPES, type);
  }

  on (type, callback) {
    if (!this.support(type)) {
      return false;
    }

    if (!_.isArray(this.events[type])) {
      this.events[type] = [];
    }

    this.events[type].push(callback);
  }

  emit (type, data) {
    if (!_.isArray(this.events[type])) {
      return false;
    }

    _.forEach(this.events[type], function (handle) {
      handle(new Event(type), data);
    });
  }

  destory () {
    _.forEach(this.events, function (callbacks, name) {
      callbacks.splice(0);
      this.events[name] = undefined;
      delete this.events;
    });
  }
}

/**
 * 记录类
 * @class
 */
class Record extends Emitter {
  static METADATA = {
    type        : 'log',
    message     : '',
    stack       : [],
    url         : document.location.href,
    userAgents  : _.map(device.userAgents(), function (agent) {
      return {
        name    : agent,
        version : device.versionStr(agent),
      };
    }),
    platform    : {
      os      : device.os(),
      phone   : device.phone(),
      tablet  : device.tablet(),
      version : device.versionStr(device.os()),
    },
    browserSize : [window.screen.width, window.screen.height],
    time        : new Date(),
  };

  static EVENT_TYPES = ['reported', 'error'];

  constructor (source = {}, options = {}) {
    super();

    this.feedback = _.isString(options.feedback) ? options.feedback : '';
    this.reported = options.hasOwnProperty('reported') ? !!options.reported : false;
    this.hashCode = hashCode(JSON.stringify(source.stack));

    this.metadata = _.defaults({
      message : source.message.replace(/^([\w\W]+?):\s*/, ''),
      type    : !_.isEmpty(options.type) ? options.type : /Error:/.exec(source.message) ? 'Error' : undefined,
    }, source, Record.METADATA);

    window.addEventListener('popstate', function (event) {
      let location = document.location;
      let state    = event.state;

      console.log(location, state);
    });
  }

  /**
   * 字符串化
   * @return {String}
   */
  toString () {
    let stack = _.map(this.metadata, function (metadata, name) {
      let alias = `${name.charAt(0).toUpperCase()}${name.substr(1)}`;

      let message = _.isArray(metadata)
        ? metadata.join('\n  ')
        : _.isObject(metadata)
          ? JSON.stringify(metadata)
          : metadata;

      return `[${alias}] ${message}`;
    });

    return stack.join('\n');
  }

  /**
   * 导出
   * @param  {Menu} type 导出类型
   * @return {string|Array} JSON串|数组
   */
  export (type) {
    if (type && 'JSON' === type.toUpperCase()) {
      return JSON.stringify(this.metadata);
    }

    return this.metadata;
  }

  print () {
    let metadata = this.metadata;

    print('groupCollapsed')(`[C:Red][${metadata.type}] ${metadata.message}[/C]`);
    print('log')(`[B][Time][/B] ${new Date(metadata.time)}`);
    print('log')(`[B][Message][/B] ${metadata.message}`);
    print('log')(`[B][URL][/B] ${metadata.url}`);

    print('groupCollapsed')('[Stack]');
    _.forEach(metadata.stack, function (row) {
      print('log')(`  ${row}`);
    });

    print('groupEnd')();

    print('log')(`[B][UserAgent][/B] ${metadata.userAgent}`);
    print('log')(`[B][Platform][/B] ${metadata.platform}`);
    print('log')(`[B][BrowserSize][/B] ${metadata.browserSize}`);

    print('groupEnd')();
  }

  /**
   * 发布给后台
   * @param  {Function} callback 回调函数
   */
  report (callback) {
    if (true === this.reporting) {
      this.on('reported', callback);
      return false;
    }

    if (true === this.reported) {
      _.isFunction(callback) && callback();
      return false;
    }

    let request = new Image();
    let source  = this.export('JSON');

    request.onload = () => {
      this.reporting = false;
      this.reported  = true;
      this.emit('reported', source);

      _.isFunction(callback) && callback(null, source);
    };

    request.onerror = (error) => {
      this.reporting = false;
      this.emit('error', error);

      _.isFunction(callback) && callback(error, source);
    };

    request.src = `${this.feedback}?msg=${source}&_=${+new Date()}${Math.random()}`;
    this.reporting = true;
  }

  /**
   * 销毁数据
   * @return {[type]} [description]
   */
  destory () {
    super.destory && super.destory();
    destoryDeepData(this);
  }
}

/**
 * 记录集合类
 * @class
 */
class Hub {
  static DEFAULTS = {
    sortBy   : 'time',
    feedback : '',
  };

  constructor (options = {}) {
    /**
     * 继承 Array
     */
    this.length = 0;
    Array.prototype.push.call(this);

    /**
     * 初始化
     */
    this.hashTable = [];
    this.setting   = this.configure(options);
  }

  /**
   * 配置
   * @param  {Object} options 配置
   * @return {Object}
   */
  configure (options = {}) {
    this.setting = _.defaults(options, Hub.DEFAULTS);
    return this.setting;
  }

  /**
   * 捕抓信息
   * @param  {Object} source 数据
   * @return {Record} 记录
   */
  _capture (source = {}, options = { feedback: Hub.DEFAULTS.feedback }) {
    if (_.isString(options)) {
      return this._capture(source, {
        feedback : Hub.DEFAULTS.feedback,
        type     : options,
      });
    }

    let buildRecord = (recordData, options) => {
      let record = new Record(recordData, options);
      record.on('reported', () => {
        this.dismiss(record);
      });

      let data = record.metadata;
      angular.collect('UA')(data.type, data.message);

      return record;
    };

    if (source instanceof Error) {
      let stack      = source.stack.split('\n').slice(1);
      let recordData = _.defaults({
        message : source.message,
        stack   : extractFromStack(stack),
      }, source);

      return buildRecord(recordData, options);
    }

    if (_.isObject(source) && !_.isEmpty(source.message)) {
      let doll       = new Error(source.message);
      let stack      = doll.stack.split('\n').slice(2);
      let recordData = _.defaults(source, {
        stack: extractFromStack(stack),
      });

      return buildRecord(recordData, options);
    }

    if (_.isString(source) && !_.isEmpty(source)) {
      return this._capture({ message: source });
    }

    return null;
  }

  /**
   * 标记信息
   * @param  {Object} source 数据
   * @return {Hub}
   */
  capture (source, options) {
    let record = this._capture(source, options);

    if (record instanceof Record) {
      let hashCode = record.hashCode;
      let index    = _.indexOf(this.hashTable, hashCode);

      if (-1 === index) {
        this.hashTable.push(hashCode);
        Array.prototype.push.call(this, record);
        this.digest();
      }

      return record;
    }

    return record;
  }

  /**
   * 丢弃数据
   * @param  {Integer|Record} record 数据
   * @return {Hub}
   */
  dismiss (record) {
    if (_.isNumber(record)) {
      return this.dismiss(this[record]);
    }

    if (record instanceof Record) {
      let index = _.indexOf(this, record);
      let items = Array.prototype.splice.call(this, index, 1);

      items.pop().destory();

      return this;
    }

    return this;
  }

  /**
   * 排序
   * @param {string} key 字段名字
   */
  sortBy (key) {
    if (Record.METADATA.hasOwnProperty(key)) {
      this.configure({ sortBy: key });
      return _.sortBy(this, this.setting.sortBy);
    }

    return this;
  }

  /**
   * 字符串化
   * @return {String}
   */
  toString () {
    let source = _.map(this, function (record) {
      return record.toString();
    });

    return source.join('\n\n');
  }

  /**
   * 导出
   * @param  {Menu} type 导出类型
   * @return {string|Array} JSON串|数组
   */
  export (type) {
    let source = _.map(this, function (record) {
      return record.export();
    });

    if (type && 'JSON' === type.toUpperCase()) {
      return JSON.stringify(source);
    }

    return source;
  }

  /**
   * 整理
   */
  digest () {
    this.sortBy();

    _.forEach(this, (record) => {
      true === record.reported && this.dismiss(record);
    });

    return this;
  }
}

let instance = new Hub();

_.assign(instance, {
  Record: Record,
  Hub: Hub,
  track () {
    return (target, name, descriptor) => {
      const method = descriptor.value;

      descriptor.value = (...args) => {
        instance.capture(name);

        return method.apply(target, args);
      };
    };
  },
});

angular.loghub = instance;

/**
 * 解析Error Stack
 * @param  {Array} stack 堆栈
 * @return {Array}
 */
function extractFromStack (stack) {
  if (_.isString(stack)) {
    return extractFromStack(stack.split('\n'));
  }

  if (_.isArray(stack)) {
    return stack.map(function (row) {
      let origin = /https?:\/\/[\w\W]+?:\d+:\d+/.exec(row);
      if (origin) {
        return origin[0];
      }

      origin = /<anonymous>:\d+:\d+/.exec(row);
      if (origin) {
        return origin[0];
      }

      return origin;
    });
  }

  return [];
}

/**
 * 打印
 * @param  {String} type 类型
 * @return {Function}
 */
function print (type = 'log') {
  /* eslint no-console: off */
  let console = window.console;
  if (!console && _.isFunction(console[type])) {
    return function () {};
  }

  return (message) => {
    message = paint(message, /\[B\]([\w\W]+?)\[\/B\]/g, 'font-weight:bolder;');
    message = paint(message, /\[C:Red\]([\w\W]+?)\[\/C\]/g, 'color:#de5233');

    console[type].apply(console, message);
  };

  function paint (message, regexp, style, originStyle = '', args = []) {
    if (_.isArray(message)) {
      return paint(message.shift(), regexp, style, originStyle, message);
    }

    if (_.isString(message)) {
      while (regexp.exec(message)) {
        message = message.replace(regexp, '%c$1%c');
        args.push(style, originStyle);
      }

      return [message].concat(args);
    }

    return [];
  }
}

/**
 * 哈希码
 * See:
 * http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery?answertab=active#tab-top
 */
function hashCode (string) {
  string = JSON.stringify(string);

  let hash = 0;
  if (0 === string.length) {
    return hash;
  }

  for (let i = 0, l = string.length; i < l; i ++) {
    let chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;

    // Convert to 32bit integer
    hash |= 0;
  }

  return hash;
}

/**
 * 深度删除数据
 * @param  {Object} source 对象
 */
function destoryDeepData (source) {
  if (_.isArray(source)) {
    source.splice(0, 1);
  }
  else if (_.isObject(source)) {
    Object.keys(source).forEach((item) => {
      if (_.isObject(source[item])) {
        return destoryDeepData(source[item]);
      }

      source[item] = undefined;
      delete source[item];
    });
  }
}

export default angular.module('qtAngularUi.loghub', [
  Conf,
])
.name;
