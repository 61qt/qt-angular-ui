import angular from 'angular'
import Alert from './components/Alert'

export const App = angular.module('App', [
  Alert
])

App.run(function ($document, $alert) {
  $document.ready(function () {
    $alert.create('message')
  })
})

angular.element(() => angular.bootstrap(document, [App.name]))

export default App.name
