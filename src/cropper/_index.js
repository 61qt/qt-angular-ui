import 'blueimp-canvas-to-blob';

import angular        from 'angular';
import Cropper        from './component';
import CropperImage   from './image.component';

export default angular.module('qtAngularUi.cropper', [])
.directive('cropper', Cropper)
.directive('cropperImage', CropperImage)
.run(($injector) => {
  if (window.angular && window.angular.env && window.angular.env.QT_UI_LOG) {
    try {
      $injector.get('cropperPromptInterceptor');
    }
    catch (e) {
      window.console.error('[qt-angular-ui]尚未进行 Cropper 的配置，请查看 qt-angular-ui/src/cropper/README.md 进行配置');
    }

    try {
      $injector.get('$qiniuUploader');
    }
    catch (e) {
      window.console.error('[qt-angular-ui]尚未进行 Cropper 的依赖配置，请查看 qt-angular-ui/src/cropper/README.md 进行配置');
    }
  }
})
.name;
