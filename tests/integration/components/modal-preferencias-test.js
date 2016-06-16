import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('modal-preferencias', 'Integration | Component | modal preferencias', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{modal-preferencias}}`);
  assert.equal(this.$().text().trim(), '', "No imprime texto si está oculto");
});
