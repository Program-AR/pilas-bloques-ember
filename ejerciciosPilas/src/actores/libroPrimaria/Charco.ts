/// <reference path="../ActorColisionable.ts"/>
/// <reference path="../../comportamientos/Hundir.ts"/>

class Charco extends ActorColisionable {

    constructor() {
        super(0, 0, { grilla: 'actor.charco.png' });
        this.definirAnimacion("parado", [0], 6, true);
    }

    provocarEnAutomata() {
        return [Hundir];
    };


    provocarEnMi() {
        return [];
    };

}
