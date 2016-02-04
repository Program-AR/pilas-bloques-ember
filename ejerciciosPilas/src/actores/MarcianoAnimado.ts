/// <reference path="ActorAnimado.ts"/>

class MarcianoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, this.opcionesImagen());

        this.definirAnimacion("correr",[7,8,9,10,11],12);
        this.definirAnimacion("parado",[0,1,2,3,4,5],5, true);
        this.definirAnimacion("recoger",[13,14,15],5);
        this.animacionesAdicionales();
    }

    opcionesImagen(){
		return { grilla: 'marcianoAnimado.png', cantColumnas: 6, cantFilas: 3 };
    }

    animacionesAdicionales(){
    	// Template method
    }
}
