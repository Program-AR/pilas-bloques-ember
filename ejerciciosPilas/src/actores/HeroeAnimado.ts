/// <reference path="ActorAnimado.ts"/>

class HeroeAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'mock_heroe.png', cantColumnas:1});
        this.definirAnimacion("correr",[0],15);
        this.definirAnimacion("parado",[0],5);
        this.definirAnimacion("recoger",[0],10);
    }
}
