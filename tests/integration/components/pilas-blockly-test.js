import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-blockly', 'Integration | Component | pilas blockly', {
  integration: true
});

test('Cuando el componente está cargando', function(assert) {
  this.render(hbs`{{pilas-blockly cargando=true pilas=pilas bloques=bloques}}`);

  assert.equal(this.$("button").length, 0, 'No muestra ningún botón');
  assert.ok(existeTexto("cargando"), "Solo muestra el texto 'cargando'");
});

test('Cuando el componente está listo para ser usado', function(assert) {
  this.render(hbs`{{pilas-blockly cargando=false pilas=pilas bloques=bloques}}`);
  
  assert.ok(existeBoton("Ejecutar"), "Tiene el botón ejecutar visible");
  assert.notOk(existeBoton("Compartir"), 'Ya no existe un botón para compartir por twitter por omisión');

  assert.ok(existeBoton("Abrir"), 'Existe un botón para cargar una solución');
  assert.ok(existeBoton("Guardar"), 'Existe un botón para guardar una solución');
});

skip('Cuando ejecuta un ejercicio', function(assert) {
  this.render(hbs`{{pilas-blockly cargando=false pilas=pilas bloques=bloques}}`);
  this.send("ejecutar");

  assert.ok(existeBoton("Reiniciar"), "Tiene el botón reiniciar visible");
});

function existeElementoConTexto(elemento, texto) {
  return this.$(elemento).text().includes(texto);
}

function existeBoton(texto) {
  return existeElementoConTexto("button", texto);
}

function existeTexto(texto) {
  return existeElementoConTexto("p", texto);
}

