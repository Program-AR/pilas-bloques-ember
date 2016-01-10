/// <reference path="ActorAnimado.ts"/>

class MariaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'maria.png', cantColumnas:10, cantFilas: 2});
        this.definirAnimacion("parado",[0,0,0],15, true);
        this.definirAnimacion("correr",[0,1,2,3,4,5],12);
        this.definirAnimacion("recoger",[11,12,13,14,15,16,17,18,19],10);
    }
}
