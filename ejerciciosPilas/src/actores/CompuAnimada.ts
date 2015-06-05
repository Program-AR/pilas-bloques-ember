/// <reference path="ActorAnimado.ts"/>

class CompuAnimada extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'compu_animada.png', cantColumnas:4, cantFilas: 1});

        this.definirAnimacion("apagada",[0],1);
        this.definirAnimacion("prendida",[1],1);

        this.definirAnimacion("claveok",[2],1);
        this.definirAnimacion("instalado",[3],1);

    }
}
