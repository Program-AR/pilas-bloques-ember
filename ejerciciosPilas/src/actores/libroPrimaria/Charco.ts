/// <reference path = "../../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "../../../node_modules/reflect-metadata/Reflect.d.ts"/>
/// <reference path="../../Mixin.ts"/>
/// <reference path="../../comportamientos/Colisionar.ts"/>
/// <reference path="../../actores/libroPrimaria/Coty.ts"/>
/// <reference path="../../comportamientos/SaltarAnimado.ts"/>
/// <reference path="../../comportamientos/Hundir.ts"/>

@mergeWith(Colisionar)
class Charco extends ActorAnimado {

    constructor() {
        super(0, 0, { grilla: 'actor.charco.png' });
        this.definirAnimacion("parado", [0], 6, true);
    }

    etiquetasDeLosActoresAfectados() {
        return ["Coty"];
    };

    comportamientosAIgnorar() {
        return [SaltarAnimado];
    };

    comportamientosQueProvoca() {
        return [Hundir];
    };

}