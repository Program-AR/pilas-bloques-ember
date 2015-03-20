/// <reference path = "ComportamientoAnimado.ts"/>
	
class RecogerTipoEspecifico extends ComportamientoAnimado {
	nombreAnimacion(){
		return 'recoger';
	}
   doActualizar(){
   		if(this.terminoAnimacion){
	        if (this.receptor.tocandoTipo(this.argumentos['tipoEspecifico'])) {
	        	var objetosEscena=pilas.escena_actual().objetos;
	            var objetos2 = objetosEscena.filter(objeto => objeto.colisiona_con(this.receptor));
	            var index = objetosEscena.indexOf(objetos2[0]);
	            pilas.escena_actual().eliminarObjeto(index);
	        } else {
	            this.receptor.decir(this.argumentos['mensajeError']);
	        }
    	}
    	return true;
    }
  
}

 

