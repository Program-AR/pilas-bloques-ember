import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas spinner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    await render(hbs`{{pilas-spinner}}`);
    assert.equal(this.element.querySelector(".spinner").className, 'spinner ', "Debe tener las clases normales del spinner");

    await render(hbs`{{pilas-spinner centered=true}}`);
    assert.equal(this.element.querySelector(".spinner").className, 'spinner spinner-centered', "Deaabe tener las clases normales del spinner");

  });
});
