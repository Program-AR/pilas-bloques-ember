/// <reference path="ActorAnimado.ts"/>

class PerroCohete extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'perro_cohete.png', cantColumnas:1, cantFilas: 7});
        
        this.definirAnimacion("correr",[4,5,6,5],15,true);
        this.definirAnimacion("parado",[4],5);
        this.definirAnimacion("recoger",[4,2,0,2,4],10);

    }
} 