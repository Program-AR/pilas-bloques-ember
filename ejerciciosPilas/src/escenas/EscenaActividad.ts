/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "Errores.ts"/>

// Esta escena sirve para todas las escenas de Ejercicios Pilas.
// Toda escena que represente una actividad debe heredar de aquí.

class EscenaActividad extends Base {
	estado;
	errorHandler = new ProductionErrorHandler(this);

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

	finalizoCorrectamente(){
	//ESTO VA ACA?
	return this.estado.soyAceptacion();
	}

}
