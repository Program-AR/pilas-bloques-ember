import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('pilas-editor', 'Integration | Component | pilas editor', {
  integration: true
});

test('it renders', function(assert) {

  this.set('pilas', {
    on: () => {},
    liberarRecursos: () => {}
  });

  this.set('model', Ember.Object.extend({
    bloques: ['controls_if']
  }).create());

  this.render(hbs`{{pilas-editor pilas=pilas model=model}}`);

  assert.ok(this.$().text().trim());
});
