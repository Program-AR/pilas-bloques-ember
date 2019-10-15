import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas toggle', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(toggle);
    assert.ok(this.element.querySelector("input"));
  });

  test('it can be disabled', async function (assert) {
    this.set("disabled", true);
    await render(toggle);
    assert.ok(this.element.querySelector("input").disabled);
  });

  test('it can be checked', async function (assert) {
    this.set("checked", true);
    await render(toggle);
    assert.ok(this.element.querySelector("input").checked);
  });

  let toggle = hbs`{{toggle isDisabled=disabled isChecked=checked}}`;
});
