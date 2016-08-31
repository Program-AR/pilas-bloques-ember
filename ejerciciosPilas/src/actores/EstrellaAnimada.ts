/// <reference path="ActorAnimado.ts"/>

class EstrellaAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'estrellaAnimada.png', cantColumnas:3, cantFilas: 1});
        this.definirAnimacion("parado",new Cuadros(0).repetirRandom(200).concat([0,1,2,2,2,1]),6,true);
        this.definirAnimacion("recoger",[0,1,2],4);

    }
}
