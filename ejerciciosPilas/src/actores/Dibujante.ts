/// <reference path="ActorAnimado.ts"/>

class Dibujante extends ActorAnimado {
    constructor(x = 0, y = 0) {
        super(x, y, { grilla: 'dibujante.png', cantColumnas: 5 });
        this.definirAnimacion("parado", new Cuadros([0, 1, 2, 1]).repetirVeces(4).concat(new Cuadros([0]).repetirVeces(40)), 4, true);
        this.definirAnimacion("correr", [3,4,4,4,4,4], 12);
        this.definirAnimacion("rotar", [3], 12);
        this.definirAnimacion("saltar", [3,4,4,4,4,4], 12);
    }
}
