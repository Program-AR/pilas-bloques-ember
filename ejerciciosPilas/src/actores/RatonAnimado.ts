/// <reference path="ActorAnimado.ts"/>

class RatonAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, { grilla: 'raton.png', cantColumnas: 9, cantFilas: 1 });
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(10).concat([1]), 1, true);
        this.definirAnimacion("correr",[2,3,4,3,4,3,4],6);
        this.definirAnimacion("recoger",[5,6,7,8],12);
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
