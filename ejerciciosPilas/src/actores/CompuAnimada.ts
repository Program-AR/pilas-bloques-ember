/// <reference path="ActorAnimado.ts"/>

class CompuAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'compu_animada.png', cantColumnas:8, cantFilas: 1});
        this.definirAnimacion("parado",[0],5);
        this.definirAnimacion("prendida",[1],5);
        this.definirAnimacion("claveok",[2],5);
        this.definirAnimacion("instalado",[3,4,5,6,7],15);
    }
}
