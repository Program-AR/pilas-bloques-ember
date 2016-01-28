/// <reference path="ActorAnimado.ts"/>

class AlimentoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'alimento_pez.png', cantColumnas:2, cantFilas: 1});
        this.definirAnimacion("parado", [0, 1], 4, true);
      }
}
