

class avanzarFilaEnCuadriculaMultiple extends ComportamientoAnimado {
	alTerminarAnimacion(){
       try{
		    this.argumentos['cuadriculaMultiple'].avanzarFila(this.receptor)   
        }
        catch(err){
           this.receptor.decir(err)
        }
   	        
    }

}