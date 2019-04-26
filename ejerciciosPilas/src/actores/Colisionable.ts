/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../../src/actores/ActorAnimado.ts"/>

abstract class Colisionable {

    teEstoyPorColisionar(actor: Actor): void {
        this.provocoAlColisionar().forEach((comportamiento: Function) => actor.hacer_luego(comportamiento))
    }

    abstract provocoAlColisionar(): Function[]

}