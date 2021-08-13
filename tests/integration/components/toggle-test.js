import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | toggle', function (hooks) {
  setupPBIntegrationTest(hooks);

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
