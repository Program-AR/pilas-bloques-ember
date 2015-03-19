/// <reference path = "../../dependencias/pilasweb.d.ts"/>


/**
 * New typescript file
 */

class ComportamientoAnimado extends Comportamiento {
	animParado = 'parado';
	
	iniciar(receptor){
		super.iniciar(receptor);
		this.receptor.cargarAnimacion(this.nombreAnimacion());
	}
	
	actualizar(){
		if(this.receptor.avanzarAnimacion()){
			this.receptor.cargarAnimacion(this.animParado);
			return true;
		}
		return false;
	}
	
	nombreAnimacion(){
		return this.animParado;
	}
} 
