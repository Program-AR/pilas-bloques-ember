import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-blockly', 'Integration | Component | pilas blockly', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pilas-blockly}}`);
  assert.ok(this.$().text().indexOf("Ejecutar") > -1, "Tiene el botón ejecutar visible");
  assert.ok(this.$().text().indexOf("Compartir") > -1, 'Existe un botón para compartir por twitter');

  assert.ok(this.$().text().indexOf("Abrir") > -1, 'Existe un botón para cargar una solución');
  assert.ok(this.$().text().indexOf("Guardar") > -1, 'Existe un botón para guardar una solución');
});
