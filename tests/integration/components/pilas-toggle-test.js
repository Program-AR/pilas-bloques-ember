import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas toggle', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(toggle);
    assert.ok(this.$("input")[0]);
  });

  test('it can be disabled', async function (assert) {
    this.set("disabled", true);
    await render(toggle);
    assert.ok(this.$("input")[0].disabled);
  });

  test('it can be checked', async function (assert) {
    this.set("checked", true);
    await render(toggle);
    assert.ok(this.$("input")[0].checked);
  });

  let toggle = hbs`{{pilas-toggle isDisabled=disabled isChecked=checked}}`;
});
