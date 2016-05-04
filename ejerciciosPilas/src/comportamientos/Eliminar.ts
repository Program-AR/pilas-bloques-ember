/// <reference path="ComportamientoConVelocidad.ts"/>

class Eliminar extends ComportamientoConVelocidad {
	postAnimacion(){
		this.receptor.eliminar();
	}
}
