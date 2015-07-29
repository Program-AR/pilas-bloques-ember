

class avanzarFilaEnCuadriculaMultiple extends ComportamientoAnimado {
	alTerminarAnimacion(){
       try{
		    //this.argumentos['cuadriculaMultiple'].avanzarFila(this.receptor)
				// se cambio para que pueda ser llamado desde las actividades.
        pilas.escena_actual().cuadricula.avanzarFila(this.receptor)
				}
        catch(err){
           this.receptor.decir(err)
        }

    }

}


class avanzarFilaEnCuadriculaMultipleDesdeCualquierLado extends ComportamientoAnimado {

	alTerminarAnimacion(){
		this.argumentos['cuadriculaMultiple'].avanzarDesdeCualquierLado(this.receptor)

	}


}
