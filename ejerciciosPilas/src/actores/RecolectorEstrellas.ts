/// <reference path="ActorAnimado.ts"/>

class RecolectorEstrellas extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'recolectorAnimado.png', cantColumnas:14, cantFilas: 1});
        this.definirAnimacion("parado",[0],2);
        this.definirAnimacion("correr",[0,1,8,1,5,6,6,6,6,6,6,2,2,0],12);
        this.definirAnimacion("recoger",[0,13,10,12,11,11,11,11,11,12,10,13,0],9);
    }
}
