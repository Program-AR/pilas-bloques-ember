/// <reference path="ComportamientoConVelocidad.ts"/>

class Eliminar extends ComportamientoConVelocidad {
	postAnimacion(){
		this.receptor.eliminar();
	}
}

class Desaparecer extends ComportamientoConVelocidad {
	postAnimacion(){
		this.receptor.suspenderHabilidadesConMovimiento();
		this.receptor.izquierda = pilas.derecha() + 1;
	}
}
