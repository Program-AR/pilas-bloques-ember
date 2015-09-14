import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-automatic-update', 'Integration | Component | pilas automatic update', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pilas-automatic-update}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pilas-automatic-update}}
      template block text
    {{/pilas-automatic-update}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
