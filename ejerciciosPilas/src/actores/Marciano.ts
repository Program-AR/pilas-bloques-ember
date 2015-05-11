/// <reference path="ActorAnimado.ts"/>

class Marciano extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'rpg.maton.png', cantColumnas:12, cantFilas: 1});

        this.definirAnimacion("correr",[3,4],15);
        this.definirAnimacion("parado",[5],5);
        this.definirAnimacion("recoger",[4,6,4],5);
        this.detener_animacion();
    }
}