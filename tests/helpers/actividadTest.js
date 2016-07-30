import { test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import {moduleForComponent} from 'ember-qunit';
import startMirage from './start-mirage';

/**
 * Inicia los tests de la actividad definiendo un grupo para qunit.
 */
export function moduloActividad(nombre) {
  let titulo = `Integration | Actividad | ${nombre}`;

  let opciones = {
    integration: true,

    setup() {
      startMirage(this.container);
    }
  };

	moduleForComponent('pilas-editor', titulo, opciones);
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
    'cantidadDeActoresAlComenzar',
    'cantidadDeActoresAlTerminar',
    'fps',
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
 *
 * Para ejemplos de invocación podés ver: actividadElAlienYLasTuercas-test.js
 */
export function actividadTest(nombre, opciones) {

  if (validarOpciones(opciones)) {
    throw new Error(`Se ha iniciado el tests ${nombre} con opciones inválidas.`);
  }

  let descripcion = opciones.descripcionAdicional || 'Se puede resolver';

	test(descripcion, function(assert) {

    let store = this.container.lookup('service:store');
    let pilas = this.container.lookup('service:pilas');
    let actividades = this.container.lookup('service:actividades');

	  return new Ember.RSVP.Promise((success) => {

      Ember.run(() => {

        // Simula el model hook del router desafío.
        store.findAll("desafio").then((data) => {
          // TODO: reemplazar la linea anterior (findAll) y la siguiente
          //       por una consulta a ember-data más específica, como la que
          //       realiza findRecord, que solo debería traer un solo registro.
          //
          //       (esto está así ahora porque se debe corregir mirage antes).
          let model = data.findBy('nombre', nombre);

          if (!model) {
            throw new Error(`No existe una actividad con el nombre ${nombre}`);
          }

          this.set('model', model);
          this.set('pilas', pilas);


          // TODO:
          // Simula el método afterModel del router. Este código se quitará
          // cuando migremos completamente a ember-data.
          let actividad = actividades.obtenerPorNombre(model.get("nombre"));
          this.set('model.actividad', actividad);

          // Carga la solución en base64, el formato que espera el componente.
          this.set('solucion', window.btoa(opciones.solucion));

          // Captura el evento de inicialización de pilas:
          this.on('onReady', function(/*instanciaPilas*/) {
            var code = actividad.generarCodigo();
            pilas.ejecutarCodigoSinReiniciar(code);


            // Intenta usar la velocidad de ejecución indicada por
            // las opciones del test.
            // Por omisión los tests se ejecutarán muy rápido.
            if (opciones.fps) {
              pilas.cambiarFPS(opciones.fps);
            } else {
              pilas.cambiarFPS(200);
            }

            if (opciones.cantidadDeActoresAlComenzar) {
              validarCantidadDeActores(opciones.cantidadDeActoresAlComenzar, assert, pilas);
            }

          });

          /**
           * Si hay un error en la actividad intenta determinar
           * si es un error esperado o no. Y en cualquiera de los
           * dos casos finaliza el test.
           */
          pilas.on("errorDeActividad", function(motivoDelError) {
            let errorEsperado = opciones.errorEsperado;

            if (errorEsperado) {
              assert.equal(motivoDelError, errorEsperado, `Ocurrió el error esperado: '${errorEsperado}'. Bien!`);
            } else {
              assert.notOk(`Ocurrió un error inesperado: '${errorEsperado}'`);
            }

            success();

          });

          pilas.on("terminaEjecucion", function(/*data*/) {

            if (opciones.cantidadDeActoresAlTerminar) {
              validarCantidadDeActores(opciones.cantidadDeActoresAlTerminar, assert, pilas);
            }


            // Los errores esperados no deberían llegar a este punto, así
            // que se emite un error.
            let errorEsperado = opciones.errorEsperado;

            if (errorEsperado) {
              assert.notOk(`No ocurrió el error esperado: '${errorEsperado}'`);
            } else {
              assert.ok(pilas.estaResueltoElProblema(), "Se puede resolver el problema");
            }

            success();

          });

          /**
           * Se instancia el componente pilas-editor con los paneles que
           * observará el usuario y una solución pre-cargada, tal y como se
           * hace dentro de la aplicación.
           */
  	      this.render(hbs`
            {{pilas-editor
              debug=false
              pilas=pilas
              model=model
              onReady="onReady"
              codigo=solucion
              codigoJavascript=""

              persistirSolucionEnURL=false

              panelCanvasVisible=true
              panelBlocklyVisible=true
              panelCodigoVisible=false
            }}
          `);

        });

      });

    });

	});
}
