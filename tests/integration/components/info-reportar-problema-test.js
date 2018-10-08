import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('info-reportar-problema', 'Integration | Component | modal reportar problema', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{info-reportar-problema}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#info-reportar-problema}}
      template block text
    {{/info-reportar-problema}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
