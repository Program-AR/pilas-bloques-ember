import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | simple-read', function(hooks) {

  let service

  let storageMock

  setupTest(hooks);

  hooks.beforeEach(function() {
    service = this.owner.lookup('service:simple-read')
    storageMock = {
      simpleRead: false,
      getUseSimpleRead() {
        return this.simpleRead
      }
    }
    service.storage = storageMock
  })

  test('If default value is true, it should show simple read', function (assert) {
    assert.ok(service.shouldShowSimpleRead(true))
  })

  test('If default value is false, it should use the storage value', function (assert) {
    storageMock.simpleRead = true
    assert.ok(service.shouldShowSimpleRead(false))
  })


});
