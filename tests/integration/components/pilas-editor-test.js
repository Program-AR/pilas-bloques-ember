import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import Actividad from 'pilas-engine-bloques/actividades/actividad';


moduleForComponent('pilas-editor', 'component:pilas-editor', {
  integration: true,
});


test('informa error si no tiene actividad', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#pilas-editor ocultarModal=true actividad=null}}{{/pilas-editor}}
  `);
  var texto_del_componente = this.$().text().trim();
  assert.equal(texto_del_componente, 'Error: tienes que inicializar este componente con una actividad.');
});

test('puede cargar una actividad y leer el título del desafío', function(assert) {
  assert.expect(1);
  var actividad = Actividad.create({actividad: actividadAlien});
  this.set('actividad', actividad);
  this.render(hbs`
    {{#pilas-editor ocultarModal=true actividad=actividad}}{{/pilas-editor}}
  `);
  var texto_del_componente = this.$().text().trim();
  var texto_esperado = 'El alien y las tuercas';
  var incluye_texto = (texto_del_componente.indexOf(texto_esperado) > -1);
  assert.ok(incluye_texto, "Muestra el título del desafío");
});

