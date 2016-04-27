/// <reference path = "ComportamientoConVelocidad.ts"/>

class SaltarAnimado extends ComportamientoConVelocidad {
	alTerminar;
	suelo;
	velocidad_inicial;
	velocidad_vertical;
	gravedad;

	preAnimacion() {
		this.velocidad_inicial = this.argumentos.velocidad_inicial || 10;
		this.alTerminar = this.argumentos.alTerminar || function(r) { };
		this.gravedad = this.argumentos.gravedad || 0.3;
		this.suelo = this.receptor.y;
		this.velocidad_vertical = this.velocidad_inicial;
		this.argumentos.cantPasos = Math.round(this.velocidad_vertical / this.argumentos.gravedad * 2);
		super.preAnimacion();
		pilas.sonidos.cargar('saltar.wav').reproducir();
	}

	darUnPaso() {
		this.receptor.y += this.velocidad_vertical;
		this.velocidad_vertical -= this.gravedad;
	}

	setearEstadoFinalDeseado(){
		this.receptor.y = this.suelo;
		this.alTerminar.call(this.receptor);
	}

	nombreAnimacion(){
		return "saltar";
	}
}
