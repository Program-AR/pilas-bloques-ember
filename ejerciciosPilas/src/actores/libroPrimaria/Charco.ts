/// <reference path = "../../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../ActorColisionable.ts"/>
/// <reference path="../../comportamientos/Hundir.ts"/>

class Charco extends ActorColisionable {

    constructor() {
        super(0, 0, { grilla: 'actor.charco.png' });
        this.definirAnimacion("parado", [0], 6, true);
    }

    afecta() {
        return pilas.obtener_actores_con_etiqueta("Coty");
    };

    provoca() {
        return [Hundir];
    };

    provocaEnMi() {
        return [];
    };

}
