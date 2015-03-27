/// <reference path = "../../dependencias/pilasweb.d.ts"/>


/**
 * @class ComportamientoAnimado
 * Esta clase está pensada para ser usada de superclase,
 * si es que se desea construir un comportamiento que se anime.
 * 
 * @example
 * Puede usarse directamente de esta manera:
 *      actor.hacer_luego(ComportamientoAnimado,{nombreAnimacion: 'correr'});
 * De esta manera el actor se animará sin hacer nada.
 * 
 * @example
 * Otra manera de usarlo es así:
 *      actor.hacer_luego(Explotar);
 *
 * Donde Explotar es una subclase y tiene definidos los siguientes métodos:
 *      nombreAnimacion(){ 
 *			return 'explosion'
 *		};
 *      alFinalizar(){
 *			this.receptor.eliminar();
 *		}
 */

class ComportamientoAnimado extends Comportamiento {
	secuenciaActualizar;
	
	iniciar(receptor){
		super.iniciar(receptor);
		this.secuenciaActualizar = new Array();
 		this.secuenciaActualizar.push(function() {
        	this.receptor.cargarAnimacion(this.nombreAnimacion());
        	this.alIniciar();
        	return true;
   		}.bind(this));
   		this.secuenciaActualizar.push(function() {
        	return this.doActualizar(); 
   		}.bind(this));
   		this.secuenciaActualizar.push(function() {
        	this.receptor.cargarAnimacion(this.nombreAnimacionParado());
        	this.alTerminar();
        	return true;
   		}.bind(this));	
	}
	
	/** No se recomienda redefinir. Redefinir en su lugar el doActualizar */
	actualizar(){
		if(this.secuenciaActualizar.length > 0) {
			if(this.secuenciaActualizar[0]()) {
				this.secuenciaActualizar.shift();
			}
    	} else {
      		return true;
    	}
	}
	
	/* Redefinir si corresponde animar el comportamiento. */
	nombreAnimacion(){
		return this.argumentos.nombreAnimacion || this.nombreAnimacionParado();
	}
	
	/* Redefinir si corresponde */
	nombreAnimacionParado(){
		return this.argumentos.nombreAnimacionParado || 'parado';
	}
	
	/* Redefinir si corresponde */
	alIniciar(){
	}
	
	/* Redefinir si corresponde */
	alFinalizar(){
	}
	
	/** Redefinir si es necesario. 
	 *  Redefinir sólo este, no el actualizar original.
	 *  Es lo que hace efectivamente el comportamiento, además de animar.
	 *  Debe retornar true cuando corresponda terminar el comportamiento.
	 *  Por defecto termina cuando termina la animación.
	 *  Al redefinir siempre debe llamarse a super */
	doActualizar(){
		return this.receptor.avanzarAnimacion()
	}
} 
