import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-canvas', 'Integration | Component | pilas canvas', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.inject.service('pilas');

  this.render(hbs`{{pilas-canvas pilas=pilas}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pilas-canvas pilas=pilas}}
      template block text
    {{/pilas-canvas}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
