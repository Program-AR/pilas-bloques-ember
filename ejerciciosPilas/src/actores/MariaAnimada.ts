/// <reference path="ActorAnimado.ts"/>

class MariaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'maria.png', cantColumnas:1, cantFilas: 1});
        this.definirAnimacion("parado",[0],15);
        this.definirAnimacion("correr",[0],5);
        this.definirAnimacion("recoger",[0],60);
    }
}
