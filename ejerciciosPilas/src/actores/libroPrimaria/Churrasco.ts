/// <reference path="../ActorAnimado.ts"/>
 class Churrasco extends ActorAnimado {
    constructor() {
        super(0, 0, {grilla: 'actor.churrasco.png', cantColumnas: 2});
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("desaparecer", [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 12);
    }

}
