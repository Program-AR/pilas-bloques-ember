/// <reference path="ActorAnimado.ts"/>

class MonoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'monkey_normal.png', cantColumnas:1, cantFilas: 1});

        this.definirAnimacion("correr",[0],15);
        this.definirAnimacion("parado",[0],5);
        this.definirAnimacion("recoger",[0],10);
    }

} 