import 'angular';
import 'angular-mocks';

import toast from '../../src/toast';

describe('toast component test', function () {
  beforeEach(angular.mock.module(toast));

  it('can run the entry module', function () {
    expect(toast).to.equal('qtAngularUi.toast');

    angular.mock.inject(function ($toast) {
      expect($toast.create).to.be.a('function');
    });
  });
});
