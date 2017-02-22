/// <reference path="../ActorAnimado.ts"/>
 class Churrasco extends ActorAnimado {
    constructor() {
        super(0, 0, {grilla: 'actor.Churrasco.png', cantColumnas:5});
        this.definirAnimacion("parado",[0],6, true);
    }

}
