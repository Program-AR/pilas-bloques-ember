/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "SaltarAnimado.ts"/>

/*
Comportamiento que hace saltar al personaje y luego decir una
frase definida por la escena
*/

class SaltarHablando extends SaltarAnimado {
    postAnimacion(){
   		this.receptor.decir(this.receptor.escena.fraseAlSaltar());
  	}
}
