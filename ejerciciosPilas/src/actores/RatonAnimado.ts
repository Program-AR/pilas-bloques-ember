/// <reference path="ActorAnimado.ts"/>

class RatonAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'raton.png', cantColumnas:7, cantFilas: 1});
        this.definirAnimacion("correr",[0,1,2],15);
        this.definirAnimacion("recoger",[0,1,2],15);



    }
}

class QuesoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'queso.png', cantColumnas:1, cantFilas: 1});
        this.definirAnimacion("parado",[0],15,true);
        this.definirAnimacion("correr",[0],15);
        this.definirAnimacion("recoger",[0],15);

    }
}
