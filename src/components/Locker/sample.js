import angular from 'angular'
import Locker from './index'

const App = angular.module('QtNgUi.Locker.Sample', [
  Locker
])

App.run(function ($document, $locker) {
  $document.ready(function () {
    $locker.show('努力加载中')
  })
})

export default App.name
