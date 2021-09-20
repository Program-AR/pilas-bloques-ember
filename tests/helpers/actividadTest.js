import { run } from '@ember/runloop';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import 'ember-qunit';
import { setupPBIntegrationTest } from '../helpers/utils'
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';
import { module, skip, test } from 'qunit';
import simulateRouterHooks from "./simulate-router.hooks";
import { failAllApiFetchs } from './utils';

/**
 * Inicia los tests de la actividad definiendo un grupo para qunit.
 */
export function moduloActividad(nombre, runActivityTests) {
  module(`Integration | Actividad | ${nombre}`, (hooks) => {
    setupPBIntegrationTest(hooks);
    setupMirage(hooks);
    runActivityTests(hooks);
  });
}

/**
 * Realiza una validación en la cantidad de actores, este función se utiliza
 * como helper para aquellos tests que intentan contar actores antes y
 * después de realizar una actividad.
 */
function validarCantidadDeActores(actoresEsperadosPorEtiqueta, assert, pilas) {
  $.each(actoresEsperadosPorEtiqueta, (etiqueta, cantidadEsperada) => {
    let mensaje = `Hay ${cantidadEsperada} actores con la etiqueta ${etiqueta}.`;
    assert.equal(pilas.contarActoresConEtiqueta(etiqueta), cantidadEsperada, mensaje);
  });
}

/**
 * Valida las opciones enviadas al test de la actividad para detectar
 * errores o inconsistencias en las opciones antes de iniciar cualquier
 * test.
 *
 * Retorna True si alguna de las opciones enviadas es incorrecta.
 */
function validarOpciones(opciones) {
  let listaDeOpciones = Object.keys(opciones);
  let opcionesValidas = [
    'solucion',
    'descripcionAdicional',
    'errorEsperado',
    'resuelveDesafio',
    'cantidadDeActoresAlComenzar',
    'cantidadDeActoresAlTerminar',
    'fps',
    'skip'
  ];

  function esOpcionInvalida(opcion) {
    return (opcionesValidas.indexOf(opcion) === -1);
  }

  let opcionesInvalidas = $.grep(listaDeOpciones, esOpcionInvalida);

  $.map(opcionesInvalidas, (opcionInvalida) => {
    let error = `La opcion enviada al test (${opcionInvalida}) es inválida.`;
    throw new Error(error);
  });

  if (opciones.errorEsperado && opciones.cantidadDeActoresAlTerminar) {
    let error = `Es inválido escribir un test que incluya un errorEsperado y conteo de actores al terminar.`;
    throw new Error(error);
  }

  return (opcionesInvalidas.length > 0);
}

/**
 * Permite realizar una prueba sobre una actividad y su comportamiento.
 *
 * Argumentos:
 *
 *  - nombre: El identificador de la actividad, por ejemplo "AlienTocaBoton".
 *  - opciones: Un diccionario de opciones, con las siguientes claves:
 *
 *        - solucion (obligatorio): El código xml de la solución en base64.
 *        - descripcionAdicional: Un string con un detalle del objetivo del test.
 *        - errorEsperado: El string que debería llevar una excepción esperada.
 *        - cantidadDeActoresAlComenzar: Un diccionario para validar la cantidad de actores en la escena.
 *        - cantidadDeActoresAlTerminar: Un diccionario para validar la cantidad de actores en la escena.
 *        - fps: Los cuadros por segundo esperados (por omisión 200 en los test y 60 normalmente).
 *        - resuelveDesafio: Si es false, verifica que la solución NO resuelva el problema.
 *        - skip: Si es true, se salteara este test.
 * 
 * Para ejemplos de invocación podés ver: actividadElAlienYLasTuercas-test.js
 */
export function actividadTest(nombre, opciones) {
  if (validarOpciones(opciones)) {
    throw new Error(`Se ha iniciado el tests ${nombre} con opciones inválidas.`);
  }

  let descripcion = opciones.descripcionAdicional || 'Se puede resolver';

  ((opciones.skip) ? skip : test)(descripcion, function (assert) {
    console.log('empece el actividadTest')
    let store = this.owner.lookup('service:store');
    let pilas = this.owner.lookup('service:pilas');
    failAllApiFetchs()
    this.owner.lookup('service:pilas-bloques-api').logout();

    //let actividades = this.owner.lookup('service:actividades');

    return new Promise((success) => {

      run(async () => {

        // Simulate the model hook from router.
        simulateRouterHooks(store);

        /** 
         * TODO: replace the findAll and findBy functions by a
         * more specific ember-data query, like findRecord which 
         * fetchs only one record.
         * 
         * (This only exist because mirage must be need fixed before).
         */
        const model = (await store.findAll("desafio")).findBy('nombre', nombre);

        if (!model) {
          throw new Error(`No existe una actividad con el nombre ${nombre}`);
        }

        this.set('model', model);
        this.set('pilas', pilas);


        // Carga la solución en base64, el formato que espera el componente.
        this.set('solucion', window.btoa(opciones.solucion));
        // Captura el evento de inicialización de pilas:

        this.set('onReady', () => {
          if (opciones.cantidadDeActoresAlComenzar) {
            validarCantidadDeActores(opciones.cantidadDeActoresAlComenzar, assert, pilas);
          }

          setTimeout(() => {
            jQuery('#turbo-button').click();
            jQuery('#run-button').click();
          }, 1000);

        });

        /**
         * Si hay un error en la actividad intenta determinar
         * si es un error esperado o no. Y en cualquiera de los
         * dos casos finaliza el test.
         */
        this.set("onErrorDeActividad", function (motivoDelError) {
          let errorEsperado = opciones.errorEsperado;

          if (errorEsperado) {
            assert.equal(motivoDelError, errorEsperado, `Ocurrió el error esperado: '${errorEsperado}'. Bien!`);
          } else {
            assert.notOk(`Ocurrió un error inesperado: '${motivoDelError}'`);
          }

          success();
        });

        this.set('onTerminoEjecucion', () => {
          if (opciones.cantidadDeActoresAlTerminar) {
            validarCantidadDeActores(opciones.cantidadDeActoresAlTerminar, assert, pilas);
          }

          // Los errores esperados no deberían llegar a este punto, así
          // que se emite un error.
          let errorEsperado = opciones.errorEsperado;

          if (errorEsperado) {
            assert.notOk(`No ocurrió el error esperado: '${errorEsperado}'`);
          } else if (opciones.resuelveDesafio === false) {
            assert.ok(!pilas.estaResueltoElProblema(), "Se esperaba que la solución no resuelva el problema");
          } else {
            assert.ok(pilas.estaResueltoElProblema(), "Se puede resolver el problema");
          }

          success();
        });

        /**
         * Se instancia el componente challenge-workspace con los paneles que
         * observará el usuario y una solución pre-cargada, tal y como se
         * hace dentro de la aplicación.
         */

        this.render(hbs`
                    {{challenge-workspace
                      debug=false
                      pilas=pilas
                      model=model
                      showCode=false
                      onReady=onReady
                      codigo=solucion
                      codigoJavascript=""
                      persistirSolucionEnURL=false
                      onTerminoEjecucion=onTerminoEjecucion
                      onErrorDeActividad=onErrorDeActividad
                      debeMostrarFinDeDesafio=false
                    }}
                  `);
      });

    });

  });



}
