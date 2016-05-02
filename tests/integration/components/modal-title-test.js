import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('modal-title', 'Integration | Component | modal title', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{modal-title}}`);


  this.render(hbs`
    {{#modal-title}}
      template block text
    {{/modal-title}}
  `);

  assert.equal(this.$().text().trim(), '');
});
