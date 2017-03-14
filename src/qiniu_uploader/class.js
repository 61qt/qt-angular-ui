import _              from 'lodash';
import angular from 'angular';
import CanvasCompress from 'canvas-compress';

const K                = 1024;
const M                = K * K;
const BASE64_REGEXP    = /^data\:image\/png\;base64\,/;
const QINIU_UPLOAD_URL = 'https:' === window.location.protocol
  ? 'https://up.qbox.me'
  : 'http://up.qiniu.com';

/**
 * 七牛上传类
 */
class QiniuUploader {
  static supported = 'undefined' !== typeof File
    && 'undefined' !== typeof Blob
    && 'undefined' !== typeof FileList
    && !!Blob.prototype.slice
    || !!Blob.prototype.webkitSlice
    || !!Blob.prototype.mozSlice
    || false;

  static DEFAULTS = {
    maxFileSize    : 4 * M,
    chunkSize      : 4 * M,
    mkblkEndPoint  : `${QINIU_UPLOAD_URL}/mkblk/`,
    mkfileEndPoint : `${QINIU_UPLOAD_URL}/mkfile/`,
    maxRetryTimes  : 3,
    assetsUrl      : '',
    compress       : {
      open    : true,
      type    : 'image/jpeg',
      width   : undefined,
      height  : undefined,
      quality : 1,
    },
    tokenGetter () {},
  };

  constructor (options) {
    this.options = _.defaultsDeep(options, QiniuUploader.DEFAULTS);
  }

  /**
   * 获取文件大小
   * @param  {File|string}   file     要上传的文件
   * @param  {Function}      callback 回调函数
   */
  getFileSize (file, callback) {
    if (BASE64_REGEXP.exec(file)) {
      let fileSize = file.length * 3 / 4 - (file.slice(0, 2).match(/\=/g) || '').length;
      callback(null, fileSize);
    }

    let reader = new FileReader();
    reader.onload = function (event) {
      callback(null, event.total);
    };

    reader.onerror = function (event) {
      callback(event);
    };

    reader.readAsDataURL(file);
  }

  /**
   * 压缩文件
   */
  compress (file, options) {
    return new Promise(function (resolve, reject) {
      if (BASE64_REGEXP.exec(file)) {
        return resolve(file);
      }

      let compressor = new CanvasCompress({
        type    : options.type,
        width   : options.width,
        height  : options.height,
        quality : options.quality,
      });

      compressor
      .process(file)
      .then(({ result }) => {
        resolve(result.blob);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * 上传文件
   * @param  {File|string}    file              需要上传的文件
   * @param  {Object}         options           配置
   * @param  {string}         options.key       保存的文件路径
   * @return {Promise}
   */
  _uploadFile (file, options = {}) {
    options = _.defaultsDeep(options, this.options);

    let promise = new Promise((resolve, reject) => {
      options.tokenGetter()
      .then(function (token) {
        if (_.isEmpty(token)) {
          return reject(new Error('缺失七牛Token'));
        }

        let xhr = new XMLHttpRequest();
        if (_.isFunction(options.onProgress)) {
          let startDate = Date.now();

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              let nowDate     = Date.now();
              let taking      = nowDate - startDate;
              let x           = event.loaded / 1024;
              let y           = taking / 1000;
              let uploadSpeed = x / y || 0;
              let formatSpeed = 1024 < uploadSpeed
                ? `${(uploadSpeed / 1024).toFixed(2)}Mb\/s`
                : `${uploadSpeed.toFixed(2)}Kb\/s`;

              let percentComplete = Math.round(event.loaded * 100 / event.total);
              options.onProgress(percentComplete, formatSpeed);
            }
          }, false);
        }

        /**
         * 监听回调
         */
        xhr.onreadystatechange = () => {
          if (4 === xhr.readyState && 200 === xhr.status && !_.isEmpty(xhr.responseText)) {
            try {
              let blkRet = JSON.parse(xhr.responseText);
              let data   = {
                image : options.assetsUrl + blkRet.key,
                data  : blkRet,
              };

              if (_.isFunction(options.responseInterceptor)) {
                options.responseInterceptor({ response: data })
                .then(function (response) {
                  resolve(response);
                })
                .catch(function (rejection) {
                  reject(rejection);
                });
              }

              resolve(data);
            }
            catch (parseError) {
              reject(parseError);
            }
          }
          else if (200 !== xhr.status && xhr.responseText) {
            reject(new Error('网络服务有误, 请重新尝试'));
          }
        };

        /**
         * Base64 文件上传
         */
        if (BASE64_REGEXP.exec(file)) {
          let content   = file.replace(BASE64_REGEXP, '');
          let uploadUrl = `${QINIU_UPLOAD_URL}/putb64/-1`;

          if (options.key && angular.isString(options.key)) {
            uploadUrl += `/key/${options.key}`;
          }

          xhr.open('POST', uploadUrl, true);
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.setRequestHeader('Authorization', `UpToken ${token}`);
          xhr.send(content);
        }
        /**
         * 普通表单文件上传
         */
        else {
          let formData = new FormData();
          if (!_.isEmpty(options.key)) {
            formData.append('key', options.key);
          }

          formData.append('token', token);
          formData.append('file', file);

          xhr.open('POST', QINIU_UPLOAD_URL, true);
          xhr.send(formData);
        }

        /**
         * 终端
         * @return {[type]} [description]
         */
        promise.abort = function () {
          xhr.abort();

          reject(new Error('断开服务'));
          return promise;
        };
      })
      .catch((rejection) => {
        reject(rejection);
      });
    });

    return promise;
  }

  /**
   * 上传文件
   * @private
   * @param  {File|string}    file              需要上传的文件
   * @param  {Object}         options           配置
   * @param  {string}         options.key       保存的文件路径
   * @return {Promise}
   */
  uploadFile (file, options = {}) {
    options = _.defaultsDeep(options, this.options);

    let promise = new Promise((resolve, reject) => {
      /**
       * 验证文件大小是否超过设置最大限度
       */
      this.getFileSize(file, (error, fileSize) => {
        if (error) {
          return reject(error);
        }

        let maxSize  = options.maxFileSize || 0;
        let showSize = M < maxSize
          ? `${(maxSize / M).toFixed(2)}Mb`
          : `${(maxSize / K).toFixed(2)}Kb`;

        /**
         * 判断文件大小
         */
        if (fileSize > maxSize) {
          return reject(new Error(`上传文件大小不能超过${showSize}`));
        }

        this._uploadFile(file, options)
        .then((response) => {
          resolve(response);
        })
        .catch((rejection) => {
          reject(rejection);
        });
      });
    });

    return promise;
  }

  /**
   * 上传图片
   * @param  {File|string}    file              需要上传的文件
   * @param  {Object}         options           配置
   * @param  {string}         options.key       保存的文件路径
   * @return {Promise
   */
  uploadImage (file, options = {}) {
    options = _.defaultsDeep(options, this.options);

    return new Promise((resolve, reject) => {
      if (true === options.compress.open) {
        /**
         * 压缩图片
         */
        this.compress(file, options.compress)
        .then((file) => {
          /**
           * 上传文件
           */
          this.uploadFile(file, options)
          .then((response) => {
            resolve(response);
          })
          .catch((rejection) => {
            reject(rejection);
          });
        })
        .catch((rejection) => {
          reject(rejection);
        });
      }
      else {
        this.uploadFile(file, options)
        .then((response) => {
          resolve(response);
        })
        .catch((rejection) => {
          reject(rejection);
        });
      }
    });
  }
}

export default QiniuUploader;