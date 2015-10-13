/// <reference path="ActorAnimado.ts"/>

class RecolectorEstrellas extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'recolectorAnimado.png', cantColumnas:14, cantFilas: 1});
        this.definirAnimacion("serAnimado",[0,1,2],15);
        this.definirAnimacion("parado",[0,1,2],15);
        this.definirAnimacion("correr",[3,4,5,6,7],5);
        this.definirAnimacion("recoger",[7,8,9,10,11,12,13,7],60);


    }
}
