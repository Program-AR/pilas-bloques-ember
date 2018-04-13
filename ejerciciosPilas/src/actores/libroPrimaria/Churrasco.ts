/// <reference path="../ActorAnimado.ts"/>
 class Churrasco extends ActorAnimado {
    constructor() {
        super(0, 0, {grilla: 'actor.churrasco.png'});
        this.definirAnimacion("parado",[0],6, true);
    }

}
