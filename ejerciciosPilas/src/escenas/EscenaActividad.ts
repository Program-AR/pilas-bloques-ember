/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "Errores.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>
/// <reference path = "EstadosDeEscena.ts"/>

// Esta escena sirve para todas las escenas de Ejercicios Pilas.
// Toda escena que represente una actividad debe heredar de aquí.

class EscenaActividad extends Base {
	estado = new Estado();
	errorHandler = new ProductionErrorHandler(this);
	automata : ActorAnimado;
	cuadricula : Cuadricula;
	fondo;

	actualizar() : void {
		try {
			super.actualizar();
		} catch (e) {
			this.errorHandler.handle(e);
		}
	}

	estaResueltoElProblema() : Boolean {
		return this.estado.soyAceptacion();
	}

	// TODO: Deprecar, reemplazar por contarActoresConEtiqueta.
	cantidadObjetosConEtiqueta(etiqueta : String) : Number{
		return pilas.obtener_actores_con_etiqueta(etiqueta).length
	}
	personajePrincipal(): ActorAnimado {
		return this.automata;
	}

	maxZ() : Number {
		return this.stage.children[0].z;
	}

	minZ(): Number {
		return this.stage.children[this.stage.children.length - 1].z;
	}

	obtenerActoresConEtiqueta(etiqueta : string) : Array<ActorAnimado> {
		return this.actores.filter(actor => actor.tiene_etiqueta(etiqueta));
	}

	contarActoresConEtiqueta(etiqueta : string) : number {
		return this.obtenerActoresConEtiqueta(etiqueta).length;
	}

	/**
	 * Computa un multiplicador que crece según la cantidad de filas y columnas de la cuadrícula.
	 * El multiplicador es 1 si la cuadrícula es de 1x1, y crece acotado por maxRatio.
	 * Es útil para aplicar un factor de escala a los elementos cuando las casillas son muy pequeñas.
	 */
	escalaSegunCuadricula(maxRatio : number) : number {
		return maxRatio - ((maxRatio - 1) / Math.max(this.cuadricula.cantFilas, this.cuadricula.cantColumnas))
	}
}
