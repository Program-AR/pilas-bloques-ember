/// <reference path = "../../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../ActorColisionable.ts"/>
/// <reference path="../../actores/libroPrimaria/Coty.ts"/>
/// <reference path="../../comportamientos/SaltarAnimado.ts"/>
/// <reference path="../../comportamientos/Hundir.ts"/>

class Charco extends ActorColisionable {

    constructor() {
        super(0, 0, { grilla: 'actor.charco.png' });
        this.definirAnimacion("parado", [0], 6, true);
    }

    afecta() {
        return [Coty];
    };

    ignora() {
        return [SaltarAnimado];
    };

    provoca() {
        return [Hundir];
    };

}
