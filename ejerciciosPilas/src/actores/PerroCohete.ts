/// <reference path="ActorAnimado.ts"/>

class PerroCohete extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'perro_cohete.png', cantColumnas:1, cantFilas: 7});
        
        this.definirAnimacion("correr",[4,5,6,5],15);
        this.definirAnimacion("parado",[4],5);
    }
} 