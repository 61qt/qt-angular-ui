import 'lodash';
import angular  from 'angular';

// Vendors
import UIRouter from 'angular-ui-router';

// Helpers
import './spreads';

// Public
import Service  from './services';
import Filter   from './filters';
import Config   from './config';

export default angular.module('library', [
  UIRouter,
  Service,
  Filter,
  Config,
])
.name;
