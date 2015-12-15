import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import actividadElRecolectorDeEstrellas from 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas';

import actividadLaEleccionDelMono from 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono';
import actividadElMonoYLasBananas from 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas';
import actividadLightbotEnScratch from 'pilas-engine-bloques/actividades/actividadLightbotEnScratch';
import actividadFutbolRobots from 'pilas-engine-bloques/actividades/actividadFutbolRobots';
import actividadElPlanetaDeNano from 'pilas-engine-bloques/actividades/actividadElPlanetaDeNano';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';
import actividadLightbotRecargado from 'pilas-engine-bloques/actividades/actividadLightbotRecargado';
import actividadSuperTito1 from 'pilas-engine-bloques/actividades/actividadSuperTito1';
import actividadSuperTito2 from 'pilas-engine-bloques/actividades/actividadSuperTito2';

import actividadMariaLaComeSandias from 'pilas-engine-bloques/actividades/actividadMariaLaComeSandias';
import actividadElMarcianoEnElDesierto from 'pilas-engine-bloques/actividades/actividadElMarcianoEnElDesierto';
import actividadAlimentandoALosPeces from 'pilas-engine-bloques/actividades/actividadAlimentandoALosPeces';
import actividadInstalandoJuegos from 'pilas-engine-bloques/actividades/actividadInstalandoJuegos';
import actividadElGatoEnLaCalle from 'pilas-engine-bloques/actividades/actividadElGatoEnLaCalle';
import actividadNoMeCansoDeSaltar from 'pilas-engine-bloques/actividades/actividadNoMeCansoDeSaltar';
import actividadReparandoLaNave from 'pilas-engine-bloques/actividades/actividadReparandoLaNave';
import actividadElMonoQueSabeContar from 'pilas-engine-bloques/actividades/actividadElMonoQueSabeContar';
import actividadTresNaranjas from 'pilas-engine-bloques/actividades/actividadTresNaranjas';
import actividadLaberintoCorto from 'pilas-engine-bloques/actividades/actividadLaberintoCorto';
import actividadLaberintoLargo from 'pilas-engine-bloques/actividades/actividadLaberintoLargo';
import actividadLaberintoConQueso from 'pilas-engine-bloques/actividades/actividadLaberintoConQueso';
import actividadElCangrejoAguafiestas from 'pilas-engine-bloques/actividades/actividadElCangrejoAguafiestas';

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
test('puede resolver la actividad "Alien toca boton"', function(assert) {
    assert.expect(1);

    var actividad = Actividad.create({actividad: actividadAlienTocaBoton});
    var solucion = Ember.Object.create({
      codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="4"><next><block type="MoverACasillaDerecha" id="7"><next><block type="MoverACasillaDerecha" id="10"><next><block type="ApretarBoton" id="13"></block></next></block></next></block></next></block></statement></block></xml>',
      nombreDesafio: 'AlienTocaBoton',
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
        assert.ok(true,pilas.escena_actual().estaResueltoElProblema());
        success();
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
      assert.ok(true,pilas.escena_actual().estaResueltoElProblema());

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
      assert.ok(true,pilas.escena_actual().estaResueltoElProblema());
      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

      success(); // indica que los test finalizan para este desafío.
    }, false);
  });

});

test('puede resolver la actividad eleccion del mono por manzana', function(assert) {
  assert.expect(2);

  var actividad = Actividad.create({actividad: actividadLaEleccionDelMono});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="20"><next><block type="sino" id="22" inline="true"><value name="condition"><block type="tocandoManzana" id="30"></block></value><statement name="block1"><block type="ComerManzana" id="26"></block></statement><statement name="block2"><block type="ComerBanana" id="34"></block></statement></block></next></block></statement></block></xml>',
    nombreDesafio: 'LaEleccionDelMono'
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
      debeTenerTantosActoresConEtiqueta(assert, 1, "MonoAnimado");
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

test('puede resolver la actividad eleccion del mono por banana', function(assert) {
  assert.expect(2);

  var actividad = Actividad.create({actividad: actividadLaEleccionDelMono});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="20"><next><block type="sino" id="22" inline="true"><value name="condition"><block type="tocandoBanana" id="44"></block></value><statement name="block1"><block type="ComerBanana" id="34"></block></statement><statement name="block2"><block type="ComerManzana" id="26"></block></statement></block></next></block></statement></block></xml>',
    nombreDesafio: 'LaEleccionDelMono'
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
      debeTenerTantosActoresConEtiqueta(assert, 1, "MonoAnimado");
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

test('puede resolver la actividad alimentando a los peces', function(assert) {
  assert.expect(2);
  var actividad = Actividad.create({actividad: actividadAlimentandoALosPeces});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="109"><mutation name="recoger alimento"></mutation><next><block type="procedures_callnoreturn" id="244"><mutation name="alimentarabajo"></mutation><next><block type="procedures_callnoreturn" id="250"><mutation name="irarriba"></mutation><next><block type="procedures_callnoreturn" id="238"><mutation name="alimentar arriba"></mutation></block></next></block></next></block></next></block></statement></block><block type="local_var_set" id="257" inline="true" x="0" y="0"><field name="VAR">local</field></block><block type="procedures_defnoreturn" id="116" x="240" y="128"><mutation></mutation><field name="NAME">alimentarabajo</field><statement name="STACK"><block type="repetir" id="135" inline="true"><value name="count"><block type="math_number" id="136"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="123"><next><block type="AlimentarPez" id="130"></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="144" x="522" y="135"><mutation></mutation><field name="NAME">alimentar arriba</field><statement name="STACK"><block type="repetir" id="190" inline="true"><value name="count"><block type="math_number" id="191"><field name="NUM">3</field></block></value><statement name="block"><block type="AlimentarPez" id="202"><next><block type="MoverACasillaIzquierda" id="209"></block></next></block></statement><next><block type="AlimentarPez" id="232"></block></next></block></statement></block><block type="procedures_defnoreturn" id="9" x="30" y="227"><mutation></mutation><field name="NAME">recoger alimento</field><statement name="STACK"><block type="repetir" id="38" inline="true"><value name="count"><block type="math_number" id="39"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="46"></block></statement><next><block type="MoverACasillaArriba" id="53"><next><block type="MoverACasillaArriba" id="64"><next><block type="AgarrarComida" id="71"><next><block type="MoverACasillaAbajo" id="82"><next><block type="MoverACasillaAbajo" id="89"><next><block type="repetir" id="94" inline="true"><value name="count"><block type="math_number" id="95"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaIzquierda" id="102"></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="155" x="274" y="300"><mutation></mutation><field name="NAME">irarriba</field><statement name="STACK"><block type="repetir" id="171" inline="true"><value name="count"><block type="math_number" id="172"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="179"></block></statement></block></statement></block></xml>',
    nombreDesafio: 'AlimentandoAlosPeces'
  });

  this.set('actividad', actividad);
  this.set('solucion', solucion);
  return new Ember.RSVP.Promise((success) => {

    this.render(hbs`
      {{#pilas-editor ocultarModal=true autoejecutar=true actividad=actividad
                      solucion=solucion}}{{/pilas-editor}}
    `);

    window.addEventListener('terminaCargaInicial', () => {
      debeTenerTantosActoresConEtiqueta(assert, 1, "BuzoAnimado");
    }, false);

    window.addEventListener('terminaEjecucion', () => {
      assert.ok(true,pilas.escena_actual().estaResueltoElProblema());
      success(); // indica que los test finalizan para este desafío.
    }, false);
  });

});


/*
test('puede resolver la actividad tito enciende las luces', function(assert) {
  assert.expect(4);

  var actividad = Actividad.create({actividad: actividadLightbotEnScratch});
  var solucion = Ember.Object.create({
    codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="45" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaArriba" id="115"><next><block type="procedures_callnoreturn" id="59"><mutation name="encender diagonal"></mutation><next><block type="procedures_callnoreturn" id="144"><mutation name="acomodarse en la otra diagonal"></mutation><next><block type="procedures_callnoreturn" id="156"><mutation name="encender diagonal"></mutation></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="56" x="22" y="172"><mutation></mutation><field name="NAME">encender diagonal</field><statement name="STACK"><block type="repetir" id="76" inline="true"><value name="count"><block type="math_number" id="77"><field name="NUM">3</field></block></value><statement name="block"><block type="EncenderLuz" id="65"><next><block type="MoverACasillaDerecha" id="86"><next><block type="MoverACasillaArriba" id="92"></block></next></block></next></block></statement><next><block type="EncenderLuz" id="98"></block></next></block></statement></block><block type="procedures_defnoreturn" id="109" x="22" y="380"><mutation></mutation><field name="NAME">acomodarse en la otra diagonal</field><statement name="STACK"><block type="repetir" id="122" inline="true"><value name="count"><block type="math_number" id="123"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="129"></block></statement><next><block type="MoverACasillaIzquierda" id="135"></block></next></block></statement></block></xml>',
    nombreDesafio: 'LaEle'
  });

  this.set('actividad', actividad);
  this.set('solucion', solucion);

  return new Ember.RSVP.Promise((success) => {

    this.render(hbs`
      {{#pilas-editor ocultarModal=true autoejecutar=true actividad=actividad
                      solucion=solucion}}{{/pilas-editor}}
    `);

    window.addEventListener('terminaCargaInicial', () => {
      debeTenerTantosActoresConEtiqueta(assert, 1, "Robot");
      debeTenerTantosActoresConEtiqueta(assert, 8, "CasillaConLuz");
      //debeTenerTantosActoresConEtiqueta
      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(5, cantidad_de_tuercas, "Tienen que haber 5 tuercas al comenzar.");
    }, false);

    window.addEventListener('terminaEjecucion', () => {
      debeTenerTantosActoresConEtiqueta(assert, 1, "Robot");
      debeTenerTantosActoresConEtiqueta(assert, 8, "CasillaConLuz");

      //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
      //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

      success(); // indica que los test finalizan para este desafío.
    }, false);
});
});*/
