/// <reference path = "ComportamientoAnimado.ts"/>

class SaltarAnimado extends ComportamientoAnimado {
	alTerminar;
	suelo;
	velocidad_inicial;
	velocidad;
	gravedad;

	preAnimacion() {
		this.velocidad_inicial = this.argumentos.velocidad_inicial || 10;
		this.alTerminar = this.argumentos.alTerminar || function(r) { };
		this.gravedad = this.argumentos.gravedad || 0.3;
		this.suelo = this.receptor.y;
		this.velocidad = this.velocidad_inicial;
		pilas.sonidos.cargar('saltar.wav').reproducir();
	}

	doActualizar() {
		super.doActualizar();
		this.receptor.y += this.velocidad;
		this.velocidad -= this.gravedad;

		if (this.receptor.y <= this.suelo) {
			this.receptor.y = this.suelo;
			this.alTerminar.call(this.receptor);
			return true;
		}
	}

	nombreAnimacion(){
		return "saltar";
	}
}