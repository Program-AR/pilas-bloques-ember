/// <reference path="comportamientoColision.ts"/>



class RecogerPorEtiqueta extends ComportamientoColision{
			metodo(objetoColision){
				objetoColision.eliminar();
				if(this.argumentos['dondeReflejarValor']){
						this.argumentos['dondeReflejarValor'].aumentar(1);
				}
		}
		nombreAnimacion(){
			// redefinir por subclase
			return "recoger";
		}


}
