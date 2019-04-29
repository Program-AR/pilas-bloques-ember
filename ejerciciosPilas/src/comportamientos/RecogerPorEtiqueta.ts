/// <reference path="Interactuar.ts"/>

class RecogerPorEtiqueta extends Interactuar{
			alInteractuar(objetoColision){
				objetoColision.eliminar();
				if(this.argumentos['dondeReflejarValor']){
						this.argumentos['dondeReflejarValor'].aumentar(1);
				}
		}
		nombreAnimacion(){
			return this.argumentos.nombreAnimacion || "recoger";
		}
}
