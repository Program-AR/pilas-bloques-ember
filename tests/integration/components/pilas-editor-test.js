import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';
import actividadElRecolectorDeEstrellas from 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas';

import Actividad from 'pilas-engine-bloques/actividades/actividad';

import debeTenerTantosActoresConEtiqueta from '../../helpers/debe-tener-tantos-actores-con-etiqueta';

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


test('puede resolver la actividad alienTocaBoton', function(assert) {
  assert.expect(1);

  var actividad = Actividad.create({actividad: actividadAlienTocaBoton});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="4"><next><block type="MoverACasillaDerecha" id="7"><next><block type="MoverACasillaDerecha" id="10"><next><block type="ApretarBoton" id="13"></block></next></block></next></block></next></block></statement></block></xml>',
    nombreDesafio: 'AlienTocaBoton'
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
      assert.ok(true, "Ejemplo test");

      success(); // indica que los test finalizan para este desafío.
    }, false);
  });

});

test('puede resolver la actividad "El recolector de estrellas"', function(assert) {
  assert.expect(2);

  var actividad = Actividad.create({actividad: actividadElRecolectorDeEstrellas});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="115" inline="true"><value name="count"><block type="math_number" id="116"><field name="NUM">3</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="107"><mutation name="tomar estellas de la fila completa"></mutation><next><block type="VolverABordeIzquierdo" id="121"><next><block type="MoverACasillaArriba" id="126"></block></next></block></next></block></statement><next><block type="procedures_callnoreturn" id="129"><mutation name="tomar estellas de la fila completa"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="92" x="14" y="268"><mutation></mutation><field name="NAME">tomar estellas de la fila completa</field><statement name="STACK"><block type="repetir" id="89" inline="true"><value name="count"><block type="math_number" id="90"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="97"><next><block type="TomarEstrella" id="102"></block></next></block></statement></block></statement></block></xml>',
    nombreDesafio: 'ElRecolectorDeEstrellas',
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

    window.addEventListener('terminaCargaInicial', () => {
      debeTenerTantosActoresConEtiqueta(assert, 4*4, "EstrellaAnimada");
    }, false);

    window.addEventListener('terminaEjecucion', () => {
      debeTenerTantosActoresConEtiqueta(assert, 0, "EstrellaAnimada");
      success();
    }, false);
  });

});

test('puede resolver la actividad del alien y las tuercas', function(assert) {
  assert.expect(2);

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

    window.addEventListener('terminaCargaInicial', () => {
      debeTenerTantosActoresConEtiqueta(assert, 5, "TuercaAnimada");
      //debeTenerTantosActoresConEtiqueta
      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(5, cantidad_de_tuercas, "Tienen que haber 5 tuercas al comenzar.");
    }, false);

    window.addEventListener('terminaEjecucion', () => {
      debeTenerTantosActoresConEtiqueta(assert, 0, "TuercaAnimada");
      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

      success(); // indica que los test finalizan para este desafío.
    }, false);
  });

});
