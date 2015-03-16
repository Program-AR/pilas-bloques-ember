/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class SaltarHablando extends Saltar {
    actualizar(){
    	if (super.actualizar()){
     		this.receptor.decir(this.receptor.fraseAlSaltar());
     		return true;
    	}
  	}
}

