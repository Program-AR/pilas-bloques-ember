/// <reference path="../ActorAnimado.ts"/>
class Charco extends ActorAnimado {
    constructor() {
        super(0, 0, { grilla: 'actor.charco.png' });
        this.definirAnimacion("parado", [0], 6, true);
    }
}
