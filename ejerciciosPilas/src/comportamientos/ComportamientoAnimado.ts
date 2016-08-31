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
 *      postAnimacion(){
 *			this.receptor.eliminar();
 *		}
 *
 * @example
 * Otra manera de usarlo es independientemente de la animación
 * (Para decidir uno cuándo termina el comportamiento)
 *      actor.hacer_luego(MoverEnX,{destino: 50});
 *
 * Donde MoverEnX es subclase de ComportamientoAnimado y define:
 * 		nombreAnimacion(){
 *			return 'correr';
 *		};
 *		doActualizar(){
 *			super.doActualizar();
 *			this.receptor.x = this.receptor.x + 1;
 *			if (this.receptor.x = this.argumentos.destino){
 *				return true;
 *			}
 *		}
 * Mientras, la animación se ejecuta en un loop hasta que doActualizar devuelve true.
 */

class ComportamientoAnimado extends Comportamiento {
	secuenciaActualizar;
	animacionAnterior;
	verificacionesPre;
	verificacionesPost;

	iniciar(receptor){
		super.iniciar(receptor);
		this.sanitizarArgumentos();
		this.configurarVerificaciones();

		this.secuenciaActualizar = new Array();
 		this.secuenciaActualizar.push(function() {
			this.configuracionInicial();
        	this.preAnimacion();
        	return true;
   		}.bind(this));
   		this.secuenciaActualizar.push(function() {
        	return this.doActualizar();
   		}.bind(this));
   		this.secuenciaActualizar.push(function() {
			this.configuracionFinal();
        	this.postAnimacion();
        	return true;
   		}.bind(this));
	}

	sanitizarArgumentos(){
		this.receptor = this.argumentos.receptor || this.receptor;
		this.verificacionesPre = this.argumentos.verificacionesPre || [];
		this.verificacionesPost = this.argumentos.verificacionesPost || [];
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

	private configuracionInicial(){
		this.realizarVerificacionesPreAnimacion();
		this.receptor.detenerAnimacion(); // Porque hace quilombo
		this.animacionAnterior = this.receptor.nombreAnimacionActual();
		this.receptor.cargarAnimacion(this.nombreAnimacion());
	}

	private configuracionFinal(){
		this.receptor.animar();
		this.receptor.cargarAnimacion(this.nombreAnimacionSiguiente());
		this.realizarVerificacionesPostAnimacion();
	}

	private realizarVerificacionesPreAnimacion(){
		this.verificacionesPre.forEach(verificacion => verificacion.verificar());
		if (this.argumentos.idTransicion) pilas.escena_actual().estado.realizarTransicion(this.argumentos.idTransicion, this);
		pilas.escena_actual().estado.verificarQuePuedoSeguir();
	}

	private realizarVerificacionesPostAnimacion() {
		this.verificacionesPost.forEach(verificacion => verificacion.verificar());
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
	nombreAnimacionSiguiente(){
		if (this.argumentos.mantenerAnimacion) return this.nombreAnimacion();
		return this.argumentos.nombreAnimacionSiguiente || this.animacionAnterior;
	}

	/* Redefinir si corresponde */
	configurarVerificaciones() {
		// son varios llamados a verificacionesPre.push
		// y a verificacionesPost.push
	}

	/* Redefinir si corresponde */
	preAnimacion(){
	}

	/* Redefinir si corresponde */
	postAnimacion(){
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


class Verificacion {
	condicionEjecucion;
	mensajeError;

	constructor(condicionEjecucion, mensajeError) {
		this.condicionEjecucion = condicionEjecucion;
		this.mensajeError = mensajeError;
	}

	seCumple(){
		return this.condicionEjecucion();
	}

	verificar(){
		if (!this.seCumple()) throw new ActividadError(this.mensajeError);
	}
}

class ArgumentError implements Error {
	name;
	message;
	constructor(description) {
		this.name = "ArgumentError";
		this.message = description;
	}

	toString(){
		return this.name + ': ' + this.message;
	}
}
