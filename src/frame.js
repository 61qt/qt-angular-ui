import './frame.scss'
import URI from 'urijs'
import angular from 'angular'

let uri = new URI()
let query = uri.query()
let params = URI.parseQuery(query)
let home = params.q ? decodeURIComponent(params.q) : 'https://61qt.github.io/qt-angular-ui/sample/'
let frame = angular.element(`<iframe src="${home}" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true"></iframe>`)
angular.element(document.getElementById('stage')).append(frame)
