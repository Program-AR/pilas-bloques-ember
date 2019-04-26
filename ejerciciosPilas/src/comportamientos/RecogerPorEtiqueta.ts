/// <reference path="ComportamientoColision.ts"/>

class RecogerPorEtiqueta extends ComportamientoColision{
			alColisionar(objetoColision){
				objetoColision.eliminar();
				if(this.argumentos['dondeReflejarValor']){
						this.argumentos['dondeReflejarValor'].aumentar(1);
				}
		}
		nombreAnimacion(){
			return this.argumentos.nombreAnimacion || "recoger";
		}
}
