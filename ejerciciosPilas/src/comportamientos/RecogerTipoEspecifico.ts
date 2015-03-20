/// <reference path = "ComportamientoAnimado.ts"/>
	
class RecogerTipoEspecifico extends ComportamientoAnimado {
	nombreAnimacion(){
		return 'recoger';
	}
   doActualizar(){
   		if(this.terminoAnimacion){
	        if (pilas.escena_actual().tocandoTipo(this.receptor, this.argumentos['tipoEspecifico'])) {
				this.eliminarObjetoTocado();
	        } else {
	            this.receptor.decir(this.argumentos['mensajeError']);
	        }
    	}
    	return true;
    }
  
	eliminarObjetoTocado(){
	    pilas.escena_actual().eliminarObjeto(this.objetoTocando());
	}
	
	objetoTocando(){
		return pilas.escena_actual().objetoTocandoA(this.receptor);
	}
}

 

