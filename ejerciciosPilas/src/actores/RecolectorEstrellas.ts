/// <reference path="ActorAnimado.ts"/>

class RecolectorEstrellas extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'recolectorAnimado.png', cantColumnas:5, cantFilas: 1});
        this.definirAnimacion("parado",[0],2);
        this.definirAnimacion("correr",[0,1,2,3,3,3,4,0],9);
        this.definirAnimacion("recoger",[4,3,3,3,3,3,3,4],9);
    }
}
