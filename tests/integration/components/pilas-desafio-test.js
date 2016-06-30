import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-desafio', 'Integration | Component | pilas desafio', {
  integration: true
});

test('it renders', function(assert) {
  this.set("model", {id: 1, titulo: 'demo', nombre: "AlienTocaBoton", escena: "AlienTocaBoton", });
  this.set("modelDeshabilitado", {id: 1, titulo: 'demo', nombre: "AlienTocaBoton", escena: "AlienTocaBoton", deshabilitado: true});

  this.render(hbs`{{pilas-desafio model=model}}`);
  assert.equal(this.$().text().trim(), 'demo', "Muestra el Título del desafio.");

  this.render(hbs`{{pilas-desafio model=modelDeshabilitado}}`);
  assert.ok((this.$().text().trim().indexOf("Muy pronto") > -1), "Tiene el texto Muy pronto");
});
