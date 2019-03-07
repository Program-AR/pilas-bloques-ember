/// <reference path = "../../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../../Mixin.ts"/>
/// <reference path="../ActorColisionable.ts"/>
/// <reference path="../../actores/libroPrimaria/Coty.ts"/>
/// <reference path="../../comportamientos/SaltarAnimado.ts"/>
/// <reference path="../../comportamientos/Hundir.ts"/>

class Charco extends ActorAnimado implements ActorColisionable {

    constructor() {
        super(0, 0, { grilla: 'actor.charco.png' });
        this.definirAnimacion("parado", [0], 6, true);
    }

    teEstoyPorColisionar: (actor) => void

    participaraEnLaColision: (actor) => boolean

    deboIgnorarColision: (actor) => boolean

    debeIgnorarComportamiento: (comportamiento) => boolean

    etiquetasDeLosActoresAfectados() {
        return ["Coty"];
    };

    comportamientosAIgnorar() {
        return [SaltarAnimado];
    };

    ComportamientosQueProvoca() {
        return [Hundir];
    };

}

applyMixins(ActorAnimado, [ActorColisionable]);
