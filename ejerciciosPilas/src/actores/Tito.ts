/// <reference path="ActorAnimado.ts"/>

class Tito extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'tito.png', cantColumnas:8, cantFilas: 1});

        this.definirAnimacion("correr",[3,4,5,6,6,6,6,6,6,5,4,8],12);
        this.definirAnimacion("parado",[0,1,2,2,3,4],6, true);
        this.definirAnimacion("bailando",[0,1,2,2,3,4],6);
        this.definirAnimacion("recoger", [0,1,2,2,2,2,2,2,3,4], 9);

    }
}
