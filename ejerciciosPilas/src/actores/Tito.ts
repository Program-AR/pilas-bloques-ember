/// <reference path="ActorAnimado.ts"/>

class Tito extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'tito.png', cantColumnas:1, cantFilas: 1});
        
        this.definirAnimacion("caminando",[0],1);
        this.definirAnimacion("parado",[0],1);

    }
} 