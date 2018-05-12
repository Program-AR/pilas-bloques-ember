// Esto es una clara chanchada. No sé cómo usar el Error original desde Typescript

class ActividadError implements Error {
	//Modificar el message, etc.
	public name: string;
	public message: string;
	public nombreAnimacion: string; // La animación que ejecutará el autómata mientras se dice el error

	constructor(message: string = "", nombreAnimacion: string = "error") {
		this.message = message;
		this.nombreAnimacion = nombreAnimacion;
	};
}

class ProductionErrorHandler {
	escena: EscenaActividad;

	constructor(escena) {
		this.escena = escena;
	}

	handle(e: Error){
		if(e instanceof ActividadError){
				this.handleActividadError(e);
		} else {
			throw e;
		}
	}

	handleActividadError(e: ActividadError) {
		this.escena.automata.eliminar_comportamientos();
		this.escena.automata.informarError(e);

    if (parent) {
      let mensaje = {
        tipo: "errorDeActividad",
        detalle: e.message
      };
      parent.postMessage(mensaje, window.location.origin);
    }
	}
}
