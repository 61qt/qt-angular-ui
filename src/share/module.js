import angular from 'angular'

export const exists = function (name) {
  try {
    angular.module(name)
  } catch (error) {
    return false
  }

  return true
}

export const def = function (name, dependences = []) {
  return exists(name) ? angular.module(name) : angular.module(name, dependences)
}
