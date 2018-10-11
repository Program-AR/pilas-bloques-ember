/// <reference path="../ActorAnimado.ts"/>
class Charco extends ActorAnimado {
    static _grilla = 'actor.charco.png'

    constructor() {
        super(0, 0, {});
        this.definirAnimacion("parado", [0], 6, true);
    }
}
