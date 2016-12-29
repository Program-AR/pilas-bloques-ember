/// <reference path="ActorAnimado.ts"/>

class NanoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'nano.png', cantColumnas:14});
        this.definirAnimacion('parado', new Cuadros([0]).repetirVeces(30).
                                          concat([1,1,2,2]).
                                          concat(new Cuadros([2]).repetirVeces(15)).
                                          concat([2,2,1,1])
                                          , 6, true);
        this.definirAnimacion('correr', [3,4,5,6,7,8,9,10], 9);
        this.definirAnimacion('recoger', [12,13,14,15,15,15,15,14,13,12], 6);
    }
}
