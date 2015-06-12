/// <reference path="ActorAnimado.ts"/>

class RatonAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'ratonAnimado.png', cantColumnas:1, cantFilas: 1});



    }
}

class QuesoAnimado extends ActorAnimado {
    constructor(x, y) {
        super(x, y, {grilla: 'quesoAnimado.png', cantColumnas:1, cantFilas: 1});



    }
}
