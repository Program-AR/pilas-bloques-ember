import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-cargando', 'Integration | Component | pilas cargando', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-cargando}}`);
  assert.equal(this.$().text().trim(), '', "No debe tener texto alguno.");
});
