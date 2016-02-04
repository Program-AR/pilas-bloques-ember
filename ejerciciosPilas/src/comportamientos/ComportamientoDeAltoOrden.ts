/// <reference path="ComportamientoAnimado.ts"/>

	
class ComportamientoDeAltoOrden extends ComportamientoAnimado {
	nombreAnimacion(){
		return this.argumentos['nombreAnimacion'];
	}
   
	postAnimacion(){
			this.argumentos.metodo.apply(this.argumentos['receptor']);
    }

}																									