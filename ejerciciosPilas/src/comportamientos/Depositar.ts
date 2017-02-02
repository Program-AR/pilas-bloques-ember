/// <reference path="ComportamientoAnimado.ts"/>

class Depositar extends ComportamientoAnimado {
	nombreAnimacion(){
		return 'depositar';
	}

	postAnimacion() {
		this.validarQueLaClaseADepositarSeaString();
		let clase: any = window[this.argumentos.claseADepositar];

		if (this.receptor.cuadricula) {
			this.receptor.cuadricula.agregarActor(
				new clase(),
				this.receptor.casillaActual().nroFila,
				this.receptor.casillaActual().nroColumna);
		} else {
				new clase(this.receptor.x, this.receptor.y);
		}
	}

	validarQueLaClaseADepositarSeaString() {
		let tipo = typeof this.argumentos.claseADepositar;

		if (tipo !== "string") {
			throw new Error(`Se esperaba que la claseADepositar sea un string, pero se encontó ${tipo}.`)
		}
	}

}
