/// <reference path="ActorAnimado.ts"/>

class CompuAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'compu_animada.png', cantColumnas:2, cantFilas: 1});

        this.definirAnimacion("prendida",[1],1);

    }
}
