/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "Errores.ts"/>

// Esta escena sirve para todas las escenas de Ejercicios Pilas.
// Toda escena que represente una actividad debe heredar de aquí.

class EscenaActividad extends Base {
	estado;
	errorHandler = new ProductionErrorHandler(this);
	automata;
	actualizar(){
		try {
			super.actualizar();
		} catch (e) {
			if(e instanceof ActividadError){
				this.errorHandler.handle(e);
			} else {
				throw e;
			}
		}
	}

	estaResueltoElProblema(){
		return this.estado.soyAceptacion();
	}

	cantidadObjetosConEtiqueta(etiqueta){
		return pilas.obtener_actores_con_etiqueta(etiqueta).length
	}
	personajePrincipal(){
		return this.automata;
	}
}
