/// <reference path="ComportamientoAnimado.ts"/>
/// <reference path="../actores/RegaloAnimado.ts"/>

class Depositar extends ComportamientoAnimado {
	nombreAnimacion(){
		return 'depositar';
	}

	postAnimacion(){
		if(this.receptor.cuadricula){
			this.receptor.cuadricula.agregarActor(
				new this.argumentos.claseADepositar(),
				this.receptor.casillaActual().nroFila,
				this.receptor.casillaActual().nroColumna);
		} else {
				new this.argumentos.claseADepositar(this.receptor.x, this.receptor.y);
		}
	}
}
