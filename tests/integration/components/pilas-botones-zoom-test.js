import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-botones-zoom', 'Integration | Component | pilas botones zoom', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-botones-zoom}}`);
  assert.equal(this.$().text().trim(), '100%');
});
