/// <reference path="ComportamientoAnimado.ts"/>

	
class ComportamientoDeAltoOrden extends ComportamientoAnimado {
	nombreAnimacion(){
		return 'recoger';
	}
   
	alTerminarAnimacion(){
			this.argumentos.metodo.apply(this.argumentos['receptor']);
    }

}																									