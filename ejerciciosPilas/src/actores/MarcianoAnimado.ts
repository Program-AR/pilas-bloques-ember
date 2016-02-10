/// <reference path="ActorAnimado.ts"/>

class MarcianoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, this.opcionesImagen());

        this.definirAnimacion("correr",[7,8,9,10,11],12);
        this.definirAnimacion("parado",[0,1,2,3,4,5],5, true);
        this.definirAnimacion("recoger",[11,12,12,11],5);
        this.definirAnimacion("recogerHierro", [11, 12, 12, 11, 13, 13, 13], 5);
        this.definirAnimacion("recogerCarbon", [11, 12, 12, 11, 14, 14, 14], 5);
        this.definirAnimacion("comerManzana", [11, 12, 12, 11, 15, 15, 15], 5);
        this.definirAnimacion("comerNaranja", [11, 12, 12, 11, 16, 16, 16], 5);
        this.animacionesAdicionales();
    }

    opcionesImagen(){
		return { grilla: 'marcianoAnimado.png', cantColumnas: 6, cantFilas: 3 };
    }

    animacionesAdicionales(){
    	// Template method
    }
}
