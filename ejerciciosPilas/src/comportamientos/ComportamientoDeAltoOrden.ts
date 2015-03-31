/// <reference path="ComportamientoAnimado.ts"/>

	
class ComportamientoDeAltoOrden extends ComportamientoAnimado {
	nombreAnimacion(){
		return this.argumentos['nombreAnimacion'];
	}
   
	alTerminarAnimacion(){
			this.argumentos.metodo.apply(this.argumentos['receptor']);
    }

}																									