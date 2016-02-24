/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>

class AnimarSiNoEstoyYa extends ComportamientoAnimado {

	configurarVerificaciones(){
		this.verificacionesPre.push(
			new Verificacion(
				() => this.puedoRealizarAnimacionYCambio(),
				"No puedo, ya estoy " + this.argumentos.valorEstar));
	}

	puedoRealizarAnimacionYCambio() {
		return (this.esElPrimerCambioDeEstado() && !this.arrancoEnEsteEstado()) || // Porque si configuraron para arrancar en este estado, no puedo cambiar al mismo estado.
			(!this.esElPrimerCambioDeEstado() && !this.yaEstabaEnEsteEstado()); // Porque no puedo cambiar al estado en el que ya estaba.
	}

	arrancoEnEsteEstado(){
		return this.argumentos.arrancoAsi;
	}

	yaEstabaEnEsteEstado(){
		return this.receptor[this.argumentos.descripcionEstar] === this.argumentos.valorEstar;
	}

	esElPrimerCambioDeEstado(){
		return !this.receptor[this.argumentos.descripcionEstar];
	}

	postAnimacion(){
		this.receptor[this.argumentos.descripcionEstar] = this.argumentos.valorEstar;
	}

}