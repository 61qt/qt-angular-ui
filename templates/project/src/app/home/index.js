import './index.scss';

import angular    from 'angular';
import Common     from 'common';
import Components from './components';
import Template   from './home.jade';

export default angular.module('home', [
  Common,
  Components,
])
.config(function ($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider
  .state('home', {
    abstract : true,
    url      : '/home/',
    template : Template,
  });

  $urlRouterProvider.when('/', '/home/');
})
/**
 * Run before above resolve url
 * You can configure something,
 * write some common async logic.
 */
.run(function ($urlRouter) {
  $urlRouter.listen();
})
.name;
