import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { fakeUser } from '../../helpers/mocks'
import { setupClear } from '../../helpers/utils'
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | terms', function (hooks) {
  setupRenderingTest(hooks)
  setupClear(hooks)

  var storage
  hooks.beforeEach(function () {
    storage = this.owner.lookup('service:storage')
  })

  const expectTermsToShow = (assert) => assert.dom().containsText("Acepto los terminos y condiciones de uso")
  const expectTermsNotToShow = (assert) => assert.dom().doesNotContainText("Acepto los terminos y condiciones de uso")

  test('Terms should show up to an unlogged user who did not accept the ToS', async function (assert) {
    await render(hbs`<Terms/>`)
    expectTermsToShow(assert)
  });

  test('Terms should not show up to an unlogged user who accepted the ToS', async function (assert) {
    storage.saveTermsAcceptance()
    await render(hbs`<Terms/>`)
    expectTermsNotToShow(assert)
  });

  test('Terms should not show up to a logged user', async function (assert) {
    storage.saveUser(fakeUser)
    await render(hbs`<Terms/>`)
    expectTermsNotToShow(assert)
  });

});
