/// <reference path="ActorAnimado.ts"/>

class Tito extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'tito.png', cantColumnas:6, cantFilas: 1});
        
        this.definirAnimacion("correr",[1,2,3,4,4,4,4,4,4,4,3,2,5],12);
        this.definirAnimacion("parado",[0,1,2],2, true);
        this.definirAnimacion("recoger", [0,2,1,1,1,2,0], 9);

    }
} 