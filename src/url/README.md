qt-angular-ui/src/url
---

# 功能介绍
对 url 的操作，拼接、解析、序列化等等。

未进行配置的单独化处理。
和业务相关，后期可能删除。

---

# 引入

```javascript
import angular from 'angular';
import url from 'qt-angulat-ui/src/url';

let app = angular.module('app', [
  url,
]);
export default app.name;
```

# service 使用方式
无

# directive 使用方式
无

# 其他用法

## parseUrl 解析URL地址，模拟 PHP parseUrl 方法
angular.parseUrl(url)

## 将 GET 字符串解析成对象
// a=1&b=2&c=3 -> parseObject(...) -> {a:1, b:2, c:3}
angular.parseParameters(str)


## 将对象解析成 GET 数据
// {a:1,b:2,c:3} -> parseString(...) -> a=1&b=2&c=3
angular.stringifyParameters(params)

## 重定向
angular.redirect(url, options)
options.replace // 代表是否重定向，默认 false
options.delay // 延迟多久跳转
