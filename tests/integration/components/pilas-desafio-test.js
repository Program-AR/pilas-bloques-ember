import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pilas desafio', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set("model", {id: 1, titulo: 'demo', nombre: "AlienTocaBoton", escena: "AlienTocaBoton", });
    this.set("modelDeshabilitado", {id: 1, titulo: 'demo', nombre: "AlienTocaBoton", escena: "AlienTocaBoton", deshabilitado: true});

    await render(hbs`{{pilas-desafio model=model}}`);
    assert.dom().hasText('demo', "Muestra el Título del desafio.");

    await render(hbs`{{pilas-desafio model=modelDeshabilitado}}`);
    assert.ok((find().textContent.trim().indexOf("Muy pronto") > -1), "Tiene el texto Muy pronto");
  });
});
