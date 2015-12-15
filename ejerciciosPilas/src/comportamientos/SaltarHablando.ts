/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "SaltarAnimado.ts"/>

/*
Comportamiento que hace saltar al personaje y luego decir una
frase definida por la escena
*/

class SaltarHablando extends SaltarAnimado {
    alTerminarAnimacion(){
   		this.receptor.decir(pilas.escena_actual().fraseAlSaltar());
  	}
}
