/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>

class Animar extends HabilidadAnimada {
	nombreAnimacion;

	constructor(receptor, argumentos) {
		super(receptor, argumentos);
		this.setearNombreAnimacion();
		this.nombreAnimacion = this.nombreAnimacion || this.argumentos.nombreAnimacion;
		if (this.nombreAnimacion) this.receptor.cargarAnimacion(this.nombreAnimacion());
	}
	
	/* Redefinir si corresponde animar la habilidad. Debe setear this.nombreAnimacion.
	 También se puede pasar por uno de los argumentos el nombre de la animación.*/
	setearNombreAnimacion() {
	}
	
	// No redefinir
	actualizar() {
		this.receptor.avanzarAnimacion();
		this.doActualizar();
	}

	doActualizar() {
		// Redefinir para agregar comportamiento además de la animación
	}
}
