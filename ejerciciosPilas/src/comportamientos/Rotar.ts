/// <reference path = "ComportamientoConVelocidad.ts"/>

class Rotar extends ComportamientoConVelocidad {
	anguloAvance;
	anguloFinal;

	preAnimacion(){
		super.preAnimacion();
		if (!this.argumentos.angulo && this.argumentos.angulo !== 0) 
			throw new ArgumentError("Angle must be provided for Rotar to work");
		this.anguloAvance = this.argumentos.angulo / this.argumentos.cantPasos;
		this.anguloFinal = this.receptor.rotacion + this.argumentos.angulo;
	}

	darUnPaso(){
		this.receptor.rotacion += this.anguloAvance;
	}

	setearEstadoFinalDeseado(){
		this.receptor.rotacion = this.anguloFinal;
	}

	nombreAnimacion(){
		return "rotar";
	}
}