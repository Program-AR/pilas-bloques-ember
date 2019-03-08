/// <reference path = "../../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "../../../node_modules/reflect-metadata/Reflect.d.ts"/>
/// <reference path="../../Merge.ts"/>
/// <reference path="../Colisionable.ts"/>
/// <reference path="../../actores/libroPrimaria/Coty.ts"/>
/// <reference path="../../comportamientos/SaltarAnimado.ts"/>
/// <reference path="../../comportamientos/Hundir.ts"/>

@mergeWith(Colisionable)
class Charco extends ActorAnimado {

    constructor() {
        super(0, 0, { grilla: 'actor.charco.png' })
        this.definirAnimacion("parado", [0], 6, true)
    }

    comportamientosQueProvoco(): Function[] {
        return [Hundir]
    }

}