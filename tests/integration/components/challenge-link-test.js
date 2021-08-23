import { module, test } from 'qunit';
import { setupPBIntegrationTest } from '../../helpers/utils'
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas desafio', function (hooks) {
  setupPBIntegrationTest(hooks);

  test('it renders', async function (assert) {
    this.set("model", { id: 1, titulo: 'demo', nombre: "AlienTocaBoton", escena: "AlienTocaBoton", });
    this.set("modelDeshabilitado", { id: 1, titulo: 'demo', nombre: "AlienTocaBoton", escena: "AlienTocaBoton", deshabilitado: true });

    await render(hbs`{{challenge-link challenge=model}}`);
    assert.dom().hasText('demo', "Muestra el Título del desafio.");

    await render(hbs`{{challenge-link challenge=modelDeshabilitado}}`);
    assert.dom('div.ribbon.semi-transparente').exists();
  });

});
