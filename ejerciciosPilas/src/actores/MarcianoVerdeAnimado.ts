/// <reference path="ActorAnimado.ts"/>

class MarcianoVerdeAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'marcianoVerdeAnimado.png', cantColumnas:6, cantFilas: 6});
        this.definirAnimacion("parado",[0,1,2,3,4,5],15,true);
        this.definirAnimacion("correr",[7,8,9,10,11],15);
        this.definirAnimacion("recogerHierro",[13,14,15],15);
        this.definirAnimacion("recogerCarbon",[24,25,26],15);
    }
}
