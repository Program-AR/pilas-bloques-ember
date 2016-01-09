/// <reference path="ActorAnimado.ts"/>

class Tito extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'tito.png', cantColumnas:1, cantFilas: 1});
        
        this.definirAnimacion("correr",[0],60);
        this.definirAnimacion("parado",[0],60);
        this.definirAnimacion("recoger", [0], 60);

    }
} 