qt-angular-ui/src/restangular
---

# 功能介绍
配置 restangular 的拦截方式，链接模式，返回模式。
未进行配置的单独化处理。

---

# 引入

```javascript
import angular from 'angular';
import restangular from 'qt-angulat-ui/src/restangular';

let app = angular.module('app', [
  restangular,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无

# 其他使用方式

```javascript
// 定义 model
angular.module('model.home', [])
.factory('mHome', function ($location, Restangular) {
  const service = Restangular.service('common');

  /**
   * 获取页面配置
   */
  service.config = function () {
    return service.one('config').get();
  };
}

// 定义 controller
export default class HomeController {
  constructor (mHome) {
    'ngInject';

    mHome.config()
    .then((res) => {
      window.consle.log(res);
    })
    .catch((rej) => {
      window.consle.log(rej);
    })
  }
}
```