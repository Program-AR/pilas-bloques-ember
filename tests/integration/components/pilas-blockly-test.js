import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('pilas-blockly', 'Integration | Component | pilas blockly', {
  integration: true,
  setup() { //TODO: Mover a un lugar más general
    this.set('cargando', false);
    this.set('bloques', ['repetir']);
    
    let pilasMock = { reiniciarEscenaCompleta(){ } };
    this.set('pilas', pilasMock);

    let modelMock = { get(attr) { return this[attr]; }, estiloToolbox: 'aplanado' };
    this.set('model', modelMock);

    let interpreteMock = { run() { return false; }};
    let interpreterFactoryMock = Ember.Service.extend({ crearInterprete(){ return interpreteMock; }});
    this.register('service:interpreterFactory', interpreterFactoryMock);

    let environmentMock = Ember.Service.extend({ });
    this.register('service:environment', environmentMock);

    this.container.lookup('service:blocksGallery').start();
  }
});

test('Cuando el componente está cargando', function(assert) {
  this.set('cargando', true);
  this.render(pilasBlockly());

  assert.equal(this.$("button").length, 0, 'No muestra ningún botón');
  assert.ok(existeTexto("cargando"), "Solo muestra el texto 'cargando'");
});

test('Cuando el componente está listo para ser usado', function(assert) {
  this.render(pilasBlockly());
  
  assert.ok(existeBoton("Ejecutar"), "Tiene el botón ejecutar visible");
  assert.notOk(existeBoton("Compartir"), 'Ya no existe un botón para compartir por twitter por omisión');
  assert.ok(existeBoton("Abrir"), 'Existe un botón para cargar una solución');
  assert.ok(existeBoton("Guardar"), 'Existe un botón para guardar una solución');
});

test('Cuando ejecuta un ejercicio', function(assert) {
  this.render(pilasBlockly());
  
  this.$("button:contains('Ejecutar')").click();
  
  assert.ok(existeBoton("Reiniciar"), "Tiene el botón reiniciar visible");
});

function pilasBlockly() {
  return hbs`{{pilas-blockly cargando=cargando pilas=pilas bloques=bloques model=model modelActividad=model}}`;
}

function existeElementoConTexto(elemento, texto) {
  return this.$(elemento).text().includes(texto);
}

function existeBoton(texto) {
  return existeElementoConTexto("button", texto);
}

function existeTexto(texto) {
  return existeElementoConTexto("p", texto);
}

