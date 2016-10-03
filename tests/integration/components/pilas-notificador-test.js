import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-notificador', 'Integration | Component | pilas notificador', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-notificador}}`);
  assert.ok(this.$().text().trim(), 'Hay algo de texto');
});
