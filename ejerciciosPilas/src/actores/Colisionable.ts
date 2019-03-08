/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../../src/actores/ActorAnimado.ts"/>

abstract class Colisionable {

    teEstoyPorColisionar(actor: Actor): void {
        this.comportamientosQueProvoco().forEach((clazz: Function) => actor.hacer_luego(clazz));
    }

    abstract comportamientosQueProvoco(): Function[]

}