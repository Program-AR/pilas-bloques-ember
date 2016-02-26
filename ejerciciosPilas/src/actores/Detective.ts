/// <reference path="ActorAnimado.ts"/>

class Detective extends ActorAnimado {
    constructor(x = 0, y = 0) {
        super(x, y, {grilla: 'detective.png', cantColumnas:1});
        this.definirAnimacion("parado", [0], 4, true);
    }
}
