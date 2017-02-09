/// <reference path="ComportamientoConVelocidad.ts"/>


// El objetivo de este comportamiento es poder encolar en
// la cola de comportamientos DEL RECEPTOR un comportamiento que ejecute
// EN EL OBJETO TOCADO, para que ejecute antes de que el receptor siga su camino.
class EsperarAnimacionTocado extends ComportamientoConVelocidad {
	iniciar(receptor){
		this.argumentos.receptor = receptor.objetoTocado(this.argumentos.etiqueta);
		super.iniciar(receptor);
	}
}
