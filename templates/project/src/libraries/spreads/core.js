import _       from 'lodash';
import angular from 'angular';

/**
 * Extend angular module and oter provider
 * if name exists, it do not print in origin angular
 * so, extend print the name when override others.
 */

const NO_CONFLICT_FUNCS = [
  {
    name    : 'provider',
    message : 'Provider "<%= name %>" is already exists, it would override the other one.',
  },
  {
    name    : 'factory',
    message : 'Factory "<%= name %>" is already exists, it would override the other one.',
  },
  {
    name    : 'service',
    message : 'Service "<%= name %>" is already exists, it would override the other one.',
  },
  {
    name    : 'controller',
    message : 'Controller "<%= name %>" is already exists, it would override the other one.',
  },
  {
    name    : 'filter',
    message : 'Filter "<%= name %>" is already exists, it would override the other one.',
  },
  {
    name    : 'directive',
    message : 'Directive "<%= name %>" is already exists, it would override the other one.',
  },
  {
    name    : 'component',
    message : 'Component "<%= name %>" is already exists, it would override the other one.',
  },
];

let origin    = angular.module;
let modules   = [];
let factories = [];

angular.module = function (name, dependent) {
  /* eslint no-console: off */
  if (!_.isEmpty(name) && _.isArray(dependent)) {
    -1 === modules.indexOf(name)
    ? modules.push(name)
    : console.warn(`Module "${name}" is already exists, it maybe override other services, controllers...`);
  }

  let module = origin.apply(angular, arguments);
  NO_CONFLICT_FUNCS.forEach(function (item) {
    noConflict(module, item.name, item.message);
  });

  return module;
};

function noConflict (module, funcName, message) {
  let origin = module[funcName];

  module[funcName] = function (name, factory) {
    /* eslint no-console: off */
    if (!_.isEmpty(name) && _.isArray(factory) || _.isFunction(factory)) {
      -1 === factories.indexOf(name)
      ? factories.push(name)
      : console.warn(_.template(message)({ name: name }));
    }

    return origin.apply(module, arguments);
  };
}
