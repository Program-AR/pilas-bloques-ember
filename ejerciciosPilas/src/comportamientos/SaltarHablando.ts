/// <reference path = "../../dependencias/pilasweb.d.ts"/>

/*
Comportamiento que hace saltar al personaje y luego decir una
frase definida por la escena
*/

class SaltarHablando extends Saltar {
    iniciar(receptor){
      super.iniciar(receptor);
    }
    actualizar(){
    	if (super.actualizar()){
     		this.receptor.decir(pilas.escena_actual().fraseAlSaltar());
     		return true;
    	}
  	}
}
