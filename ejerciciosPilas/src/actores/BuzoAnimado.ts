/// <reference path="ActorAnimado.ts"/>

class BuzoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'buzo.png', cantColumnas:8, cantFilas: 1});
        this.definirAnimacion("parado",[0,0,0,0,0,0,0,0,0,0,0,1,2],4, true);
        this.definirAnimacion("recoger",[3,4,5,6,7],6);
    }
}
