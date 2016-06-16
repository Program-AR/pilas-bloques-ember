import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('modal-ayuda', 'Integration | Component | modal ayuda', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{modal-ayuda}}`);
  assert.equal(this.$().text().trim(), '', "No imprime texto si está oculto.");
});
