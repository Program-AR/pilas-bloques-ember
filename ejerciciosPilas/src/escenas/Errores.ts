// Esto es una clara chanchada. No sé cómo usar el Error original desde Typescript

class ActividadError{
	//Modificar el message, etc.
	public name: string;
	public message: string;

	constructor(message?: string) {
		this.message = message || "";
	};

	description(){
		return this.message;
	}
}

class ProductionErrorHandler {
	escena;

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
		this.escena.automata.informarError(e.description());

    if (parent) {
      let mensaje = {
        tipo: "errorDeActividad",
        detalle: e.description()
      };
      parent.postMessage(mensaje, window.location.origin);
    }
	}
}
