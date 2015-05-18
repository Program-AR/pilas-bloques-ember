/// <reference path="ComportamientoAnimado.ts"/>


class RecogerPorEtiqueta extends ComportamientoAnimado {
	nombreAnimacion(){
		return 'parado';
	}

	alTerminarAnimacion(){

   	        if (this.receptorTocandoEtiqueta(this.argumentos['etiqueta'])) {

				this.eliminarObjetoTocadoConEtiqueta(this.argumentos['etiqueta']);
	        } else {
	            this.receptor.decir(this.argumentos['mensajeError']);
	        }
    }


	eliminarObjetoTocadoConEtiqueta(etiqueta){
		//se va a eliminar un unico objeto en el caso de multiples colisiones
		return pilas.obtener_actores_con_etiqueta(etiqueta).filter(objeto => objeto.colisiona_con(this.receptor))[0].eliminar();
	}

	receptorTocandoEtiqueta(etiqueta){
		return pilas.obtener_actores_con_etiqueta(etiqueta).some(objeto => objeto.colisiona_con(this.receptor));
		}

}
