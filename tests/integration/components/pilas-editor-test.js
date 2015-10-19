import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('pilas-editor', 'Integration | Component | pilas editor', {
  integration: true
});

test('informa error si no tiene actividad', function(assert) {
  assert.expect(1);

  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('actividad', null);

  this.render(hbs`
    <script src="libs/pilasweb.js"></script>

    {{#pilas-editor actividad=actividad}}{{/pilas-editor}}
  `);

  assert.equal(this.$().text().trim(), 'Error: tienes que inicializar este componente con una actividad.');
});

test('puede cargar una actividad', function(assert) {
  var actividades = Ember.inject.service('actividades');
  var actividad = actividades.obtenerPorNombre('alien');

  assert.expect(1);

  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('actividad', actividad);

  this.render(hbs`
    <script src="libs/pilasweb.js"></script>

    {{#pilas-editor actividad=actividad}}{{/pilas-editor}}
  `);

  assert.equal(this.$().text().trim(), 'Error: tienes que inicializar este componente con una actividad.');
});
