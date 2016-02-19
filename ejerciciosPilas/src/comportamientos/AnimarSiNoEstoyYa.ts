/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>

class AnimarSiNoEstoyYa extends ComportamientoAnimado {

	configurarVerificaciones(){
		this.verificacionesPre.push(
			new Verificacion(
				() => this.puedoEmpezarConEsteComportamiento() && !this.estoyYa(),
				"No puedo, ya estoy " + this.argumentos.valorEstar));
	}

	puedoEmpezarConEsteComportamiento(){
		return this.receptor[this.argumentos.descripcionEstar] || this.argumentos.arrancoAsi;
	}

	estoyYa(){
		return this.receptor[this.argumentos.descripcionEstar] === this.argumentos.valorEstar;
	}

	postAnimacion(){
		this.receptor[this.argumentos.descripcionEstar] = this.argumentos.valorEstar;
	}

}