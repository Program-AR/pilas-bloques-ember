import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Components | simple-read-toggle', function(hooks) {

  let simpleReadToggle

  const bookMock = {
    modoLecturaSimple: true
  }

  setupTest(hooks);

  hooks.beforeEach(function() {
    simpleReadToggle = this.owner.factoryFor('component:simple-read-toggle').create()

  })

  test('If there is a book it should ask the book for its simple read mode', function (assert) {
    simpleReadToggle.set('book', bookMock)
    assert.equal(simpleReadToggle.bookSimpleReadMode(), bookMock.modoLecturaSimple)
  })

  test('If there is not a book simple read mode should be false', function (assert) {
    assert.notOk(simpleReadToggle.bookSimpleReadMode())
  })

});
