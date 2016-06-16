import { test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Actividad from 'pilas-engine-bloques/actividades/actividad';
import debeTenerTantosActoresConEtiqueta from './debe-tener-tantos-actores-con-etiqueta';
import {moduleForComponent} from 'ember-qunit';

var TestingErrorHandler = Ember.Object.extend({
  init: function() {
    this.success = this.get('success');
    this.assert = this.get('assert');
    this.expectedErrorMsg = this.get('expectedErrorMsg');
    this.assertedSomething = false;
  },

  handle: function(error){
  	pilas.escena_actual().pausar();
  	if(error.description() === this.expectedErrorMsg){
  		this.assert.ok(true, "Ocurrió el error esperado. Bien!");
  	} else {
  		this.assert.equal(error.description(),"", "Hubo un error inesperado en la actividad");
  	}
  	this.assertedSomething = true;
  	this.success();
  },

  performAsserts: function(){
  	if(this.expectedErrorMsg && !this.assertedSomething){
  		this.assert.equal("", this.expectedErrorMsg, "No ocurrió el error esperado");
  		this.assertedSomething = true;
  		this.success();
  	}
  },
});

function descripcionTest(actividad,descripcionAdicional){
	return (descripcionAdicional ? descripcionAdicional : 'Se puede resolver la actividad ' );
}

function sanitizarOpciones(opciones){
	opciones.solucion = opciones.solucion || '';
	// opciones.descripcionAdicional es opcional
	// opciones.expectedErrorMsg es opcional
	opciones.cantAsserts = opciones.cantAsserts || 0;
	/*jshint unused: vars */
    opciones.assertsPostCargaInicial = opciones.assertsPostCargaInicial || function(assert){};
    opciones.assertsPostEjecucion = opciones.assertsPostEjecucion || function(assert){};
}

export function moduloActividad(actividad){
	moduleForComponent('pilas-editor','actividad:' + actividad.id,  {  integration: true, });
}

export function actividadTest(actividad, opciones){
	sanitizarOpciones(opciones);

	test(descripcionTest(actividad,opciones.descripcionAdicional), function(assert) {
	  assert.expect(1 + opciones.cantAsserts);
	  assert.cantActores = (etiqueta,cant) => debeTenerTantosActoresConEtiqueta(assert,cant,etiqueta);

	  this.set('actividad', Actividad.create({actividad: actividad}));
	  this.set('solucion', Ember.Object.create({
	    codigoXML: opciones.solucion,
	    nombreDesafio: actividad.id,
	  }));

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
	      pilas.escena_actual().errorHandler = TestingErrorHandler.create({success: success, assert: assert, expectedErrorMsg: opciones.expectedErrorMsg});
        pilas.escena_actual().actores.forEach(a => a.ponerMaximaVelocidad && a.ponerMaximaVelocidad()); // Para que las animaciones se hagan rápido
        /*global ComportamientoConVelocidad*/
        ComportamientoConVelocidad.prototype.velocidad = function(){ return 100; }; // para que los movimientos se hagan rápido
	      opciones.assertsPostCargaInicial(assert);
	    }, false);

	    window.addEventListener('terminaEjecucion', () => {
	      opciones.assertsPostEjecucion(assert);
		  var errHandler = pilas.escena_actual().errorHandler;
		  errHandler.performAsserts();
	      if(!errHandler.assertedSomething){
	      	assert.ok(pilas.escena_actual().estaResueltoElProblema(),"Se puede resolver el problema");
	      	success(); // indica que los test finalizan para este desafío.
	      }
	    }, false);
	  });

	});
}
