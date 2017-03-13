export default class SwitchController {
  constructor ($scope) {
    $scope.checked = false;

    this.transclude = function (name, content) {
      this.transclude[name](content);
    };
  }
}
