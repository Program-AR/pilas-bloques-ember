/// <reference path="ActorAnimado.ts"/>

class EstrellaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'estrellaAnimada.png', cantColumnas:1, cantFilas: 1});
        //this.escala_x = 2;
        //this.escala_y = 2;
        this.definirAnimacion("serAnimado",[0,1,2],15);
        this.definirAnimacion("parado",[4],5);
        this.definirAnimacion("recoger",[4],5);

    }
}
