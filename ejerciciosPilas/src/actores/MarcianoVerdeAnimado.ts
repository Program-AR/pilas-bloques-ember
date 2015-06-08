/// <reference path="ActorAnimado.ts"/>

class MarcianoVerdeAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'marcianoVerdeAnimado.png', cantColumnas:3, cantFilas: 1});

        this.definirAnimacion("parado",[0],1);
        this.definirAnimacion("conHierroAnimadoEnMano",[1],1);
        this.definirAnimacion("conCarbonAnimadoEnMano",[2],1);

    }
}
