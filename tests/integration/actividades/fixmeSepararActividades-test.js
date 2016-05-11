// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

// ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
// Usando por ejemplo elRecolectorDeEstrellas-test.js

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';
import actividadLaberintoLargo from 'pilas-engine-bloques/actividades/actividadLaberintoLargo';
import actividadLaberintoCorto from 'pilas-engine-bloques/actividades/actividadLaberintoCorto';
import actividadLaberintoConQueso from 'pilas-engine-bloques/actividades/actividadLaberintoConQueso';
import actividadTresNaranjas from 'pilas-engine-bloques/actividades/actividadTresNaranjas';
import debeTenerTantosActoresConEtiqueta from '../../helpers/debe-tener-tantos-actores-con-etiqueta';

import Actividad from 'pilas-engine-bloques/actividades/actividad';


moduleForComponent('pilas-editor', 'actividad:VariasFIXME', {
  integration: true,
});


test('puede resolver la actividad laberinto corto', function(assert) {
  assert.expect(2);

  var actividad = Actividad.create({actividad: actividadLaberintoCorto});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="sino" id="9" inline="true"><value name="condition"><block type="TocandoAbajo" id="14"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="17"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="4"></block></statement></block></statement></block></xml>',
    nombreDesafio: 'LaberintoCorto'
  });

  this.set('actividad', actividad);
  this.set('solucion', solucion);


  return new Ember.RSVP.Promise((success) => {

    this.render(hbs`
      {{#pilas-editor ocultarModal=true autoejecutar=true actividad=actividad
                      solucion=solucion}}{{/pilas-editor}}
    `);

    window.addEventListener('terminaCargaInicial', () => {
      debeTenerTantosActoresConEtiqueta(assert, 1, "RatonAnimado");
      //debeTenerTantosActoresConEtiqueta
      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(5, cantidad_de_tuercas, "Tienen que haber 5 tuercas al comenzar.");
    }, false);

    window.addEventListener('terminaEjecucion', () => {
      assert.ok(true,pilas.escena_actual().estaResueltoElProblema());


      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

      success(); // indica que los test finalizan para este desafío.
    }, false);
  });


});


test('puede resolver la actividad laberinto largo', function(assert) {
  assert.expect(2);

  var actividad = Actividad.create({actividad: actividadLaberintoLargo});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="hasta" id="5" inline="true"><value name="condition"><block type="TocandoFinCamino" id="9"></block></value><statement name="block"><block type="si" id="19" inline="true"><value name="condition"><block type="TocandoAbajo" id="29"></block></value><statement name="block"><block type="MoverACasillaAbajo" id="36"></block></statement><next><block type="si" id="50" inline="true"><value name="condition"><block type="TocandoDerecha" id="57"></block></value><statement name="block"><block type="MoverACasillaDerecha" id="40"></block></statement></block></next></block></statement></block></statement></block></xml>',
    nombreDesafio: 'LaberintoLargo'
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
      debeTenerTantosActoresConEtiqueta(assert, 1, "RatonAnimado");
      //debeTenerTantosActoresConEtiqueta
      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(5, cantidad_de_tuercas, "Tienen que haber 5 tuercas al comenzar.");
    }, false);

    window.addEventListener('terminaEjecucion', () => {
      assert.ok(true,pilas.escena_actual().estaResueltoElProblema());


      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

      success(); // indica que los test finalizan para este desafío.
    }, false);
  });

});

test('puede resolver la actividad tres naranjas', function(assert) {
  assert.expect(2);

  var actividad = Actividad.create({actividad: actividadTresNaranjas});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="8" inline="true"><value name="count"><block type="math_number" id="9"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="12"><next><block type="si" id="17" inline="true"><value name="condition"><block type="TocandoNaranja" id="19"></block></value><statement name="block"><block type="ComerNaranja" id="22"></block></statement></block></next></block></statement></block></statement></block></xml>',
    nombreDesafio: 'TresNaranjas'
  });
  this.set('actividad', actividad);
  this.set('solucion', solucion);
  return new Ember.RSVP.Promise((success) => {
    this.render(hbs`
      {{#pilas-editor ocultarModal=true autoejecutar=true actividad=actividad
                      solucion=solucion}}{{/pilas-editor}}
    `);
    window.addEventListener('terminaCargaInicial', () => {
      debeTenerTantosActoresConEtiqueta(assert, 1, "MarcianoAnimado");
    }, false);

    window.addEventListener('terminaEjecucion', () => {
      assert.ok(true,pilas.escena_actual().estaResueltoElProblema());
      success();
    }, false);
  });

});
