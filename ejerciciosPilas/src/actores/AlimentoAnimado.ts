/// <reference path="ActorAnimado.ts"/>

class AlimentoAnimado extends ActorAnimado {
    constructor(x, y) {

        super(x, y, {grilla: 'alimento_pez.png', cantColumnas:1, cantFilas: 1});
      }
}
