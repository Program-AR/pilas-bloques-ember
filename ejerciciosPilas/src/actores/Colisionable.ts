/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../../src/actores/ActorAnimado.ts"/>

abstract class Colisionable {

    public teEstoyPorColisionar(actor: Actor): void {
        this.comportamientosAlColisionar().forEach((comportamiento: Function) => actor.hacer_luego(comportamiento))
    }

    public abstract comportamientosAlColisionar(): Function[]

}