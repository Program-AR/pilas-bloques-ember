import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-blockly', 'Integration | Component | pilas blockly', {
  integration: true
});

test('it renders', function(assert) {

  this.set('pilas', {
    on: function() {
    }
  });

  this.set('bloques', ['controls_if']);

  /* Cuando el componente está listo para ser usado. */
  this.render(hbs`{{pilas-blockly cargando=false pilas=pilas bloques=bloques}}`);
  assert.ok(this.$().text().indexOf("Ejecutar") > -1, "Tiene el botón ejecutar visible");
  assert.ok(this.$().text().indexOf("Compartir") === -1, 'Ya no existe un botón para compartir por twitter por omisión');

  assert.ok(this.$().text().indexOf("Abrir") > -1, 'Existe un botón para cargar una solución');
  assert.ok(this.$().text().indexOf("Guardar") > -1, 'Existe un botón para guardar una solución');

  /* Cuando el componente está cargando */
  this.render(hbs`{{pilas-blockly cargando=true pilas=pilas bloques=bloques}}`);
  assert.equal(this.$().text().indexOf("Ejecutar") > -1, true, 'Cuando carga, solamente está el botón Ejecutar (deshabilitado)');
});
