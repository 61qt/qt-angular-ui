import 'lodash';
import angular         from 'angular';

import Library         from '../libraries';
import Service         from './services';
import Filter          from './filters';
import Component       from './components';
import Config          from './config';

export default angular.module('common', [
  Library,
  Service,
  Filter,
  Component,
  Config,
])
.name;
