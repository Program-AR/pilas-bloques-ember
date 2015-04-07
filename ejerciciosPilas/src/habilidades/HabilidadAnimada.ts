/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class HabilidadAnimada extends Habilidad {

	constructor(receptor, argumentos) {
	  super(receptor, argumentos);
	  console.log(this);
	  this.receptor.cargarAnimacion(this.nombreAnimacion());
	
	}
	
	/* Redefinir si corresponde animar la habilidad. */
	nombreAnimacion(){
		return this.argumentos.nombreAnimacion;
	}
	
	actualizar() {
	    this.receptor.avanzarAnimacion();
	}
	
}
