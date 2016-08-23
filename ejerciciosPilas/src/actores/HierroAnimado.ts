/// <reference path="ActorAnimado.ts"/>

class HierroAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'hierro_animado.png', cantColumnas:3, cantFilas: 1});
        this.definirAnimacion("quedan3",[0],1);
        this.definirAnimacion("quedan2",[1],1);
        this.definirAnimacion("quedan1",[2],1);
        this.definirAnimacion("correr", [2], 1);
        this.definirAnimacion("parado", [2], 1);
    }
}
