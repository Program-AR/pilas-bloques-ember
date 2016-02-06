/// <reference path="ActorAnimado.ts"/>

class AlimentoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'alimento_pez.png', cantColumnas:4, cantFilas: 1});
        this.definirAnimacion("parado", new Cuadros(0).repetirRandom(30).concat([0,1,2,3,2,1]), 12, true);
      }
}
