import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import Actividad from 'pilas-engine-bloques/actividades/actividad';

moduleForComponent('pilas-editor', 'Integration | Component | pilas editor', {
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

test('puede cargar una actividad', function(assert) {
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


test('puede resolver la actividad del alien y las tuercas', function(assert) {
  assert.expect(0);

  var actividad = Actividad.create({actividad: actividadAlien});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="7" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="16" inline="true"><value name="count"><block type="math_number" id="17"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="23"></block></statement><next><block type="repetir" id="45" inline="true"><value name="count"><block type="math_number" id="46"><field name="NUM">4</field></block></value><statement name="block"><block type="LevantaTuerca" id="29"><next><block type="MoverACasillaAbajo" id="35"><next><block type="MoverACasillaDerecha" id="41"></block></next></block></next></block></statement><next><block type="LevantaTuerca" id="53"></block></next></block></next></block></statement></block></xml>',
    nombreDesafio: 'alien'
  });

  this.set('actividad', actividad);
  this.set('solucion', solucion);

  /* Como la tarea de ejecutar el código completo de la solución demora
   * tiempo, retorno una promesa para que ember espere a que finalice.
   * La promesa termina con la llamada a sucess.
   */
  return new Ember.RSVP.Promise((success) => {

    this.render(hbs`
      {{#pilas-editor ocultarModal=true autoejecutar=true actividad=actividad
                      solucion=solucion}}{{/pilas-editor}}
    `);

    window.addEventListener('terminaEjecucion', () => {
      //assert.ok(incluye_texto, "Muestra el título del desafío");
      success();
    }, false);
  });

});
