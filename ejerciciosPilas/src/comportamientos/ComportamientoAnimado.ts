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
 *      doActualizar(){
 *			if (this.terminoAnimacion) {
 *				this.receptor.eliminar();
 *				return true;
 *			}
 *		}
 */

class ComportamientoAnimado extends Comportamiento {
	_terminoAnimacion = true;
	
	iniciar(receptor){
		super.iniciar(receptor);
		this.receptor.cargarAnimacion(this.nombreAnimacion());
		this.alIniciarAnimacion();
	}
	
	actualizar(){
		this._terminoAnimacion = this.receptor.avanzarAnimacion();
		if(this.doActualizar()){
			this.receptor.cargarAnimacion(this.nombreAnimacionParado());
			return true;
		}
		return false;
	}
	
	get terminoAnimacion(){
		return this._terminoAnimacion;
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
	alIniciarAnimacion(){
	}
	
	/** Redefinir siempre. 
	 *  Redefinir sólo este, no el actualizar original.
	 *  Es lo que hace efectivamente el comportamiento, además de animar.
	 *  Debe retornar true cuando corresponda terminar el comportamiento */
	doActualizar(){
		return this.terminoAnimacion;
	}
} 
