import angular       from 'angular';
import Component     from './component';
import Service       from './service';
import PromptService from './prompt.service';

export default angular.module('qtAngularUi.validator', [])
.provider('validateInterceptor', Service)
.provider('validateAjaxInterceptor', Service)
.provider('validatorPromptInterceptor', PromptService)
.directive('validator', Component)
.name;
