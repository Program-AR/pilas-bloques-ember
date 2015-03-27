class RecogerPorEtiqueta extends ComportamientoAnimado {
	nombreAnimacion(){
		return 'recogerPorEtiqueta';
	}
   
   doActualizar(){
   		if(this.terminoAnimacion){

   	        if (this.receptorTocandoEtiqueta(this.argumentos['etiqueta'])) {

				this.eliminarObjetoTocadoConEtiqueta(this.argumentos['etiqueta']);
	        } else {
	            this.receptor.decir(this.argumentos['mensajeError']);
	        }
    	}
    	return true;
    }

  	
	eliminarObjetoTocadoConEtiqueta(etiqueta){
		//se va a eliminar un unico objeto en el caso de multiples colisiones
		return pilas.escena_actual().actores_con_etiqueta(etiqueta).filter.filter(objeto => objeto.colisiona_con(this.receptor))[0].eliminar();
	}

	receptorTocandoEtiqueta(etiqueta){
		return pilas.escena_actual().actores_con_etiqueta(etiqueta).some(objeto => objeto.colisiona_con(this.receptor));
		}

}