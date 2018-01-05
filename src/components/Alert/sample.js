import angular from 'angular'
import Alert from './index'

export const App = angular.module('QtNgUi.Alert.Sample', [
  Alert
])

App.run(function ($document, $alert) {
  $document.ready(function () {
    $alert.create('message')
  })
})

export default App.name
