/// <reference path="ActorAnimado.ts"/>

class HeroeAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'heroe.png', cantColumnas:6, cantFilas: 5});
        this.definirAnimacion("correr",[0,1,2,3,4,5],12);
        this.definirAnimacion("parado",[5,0,1,0],6);
        this.definirAnimacion("correrConEspada",[6,7,8,9,10,11],12);
        this.definirAnimacion("correrConSombrero", [12,13,14,15,16,17], 12);
        this.definirAnimacion("atacar", [24,25,26,27,28,29], 12);
    }
}
