import './stylesheet.scss'

import { exists as ngExistsModule, def as ngModule } from '../../share/module'
import Template from './template.pug'

export const Name = 'QtNgUi.Spinner'
export default Name

if (!ngExistsModule(Name)) {
  const App = ngModule(Name, [])

  const Component = function () {
    return {
      restrict: 'E',
      replace: true,
      template: Template
    }
  }

  App.directive('spinner', Component)
}
