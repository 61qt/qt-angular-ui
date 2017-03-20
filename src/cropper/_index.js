import 'blueimp-canvas-to-blob';

import angular        from 'angular';
import Cropper        from './component';
import CropperImage   from './image.component';
import CropperService from './service';

export default angular.module('qtAngularUi.cropper', [])
.provider('cropperPromptInterceptor', CropperService)
.directive('cropper', Cropper)
.directive('cropperImage', CropperImage)
.name;
