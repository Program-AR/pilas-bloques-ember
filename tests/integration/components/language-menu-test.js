import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setUpTestLocale } from '../../helpers/utils';

module('Integration | Component | language-menu', function (hooks) {
  setupRenderingTest(hooks);
  setUpTestLocale(hooks)

  test('Should change intl locale on language selection', async function (assert) {
    const intl = this.owner.lookup('service:intl')
    this.owner.factoryFor('component:language-menu').create().send('setLanguage', 'en-us')
    assert.equal(intl.locale, 'en-us')
  });
});
