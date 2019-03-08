/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../../src/actores/ActorAnimado.ts"/>

abstract class Colisionable {

    teEstoyPorColisionar(actor: Actor): void {
        if (!this.puedoIgnorarLoQueEstaHaciendo(actor)) {
            this.comportamientosQueProvoco().forEach((clazz: Function) => actor.hacer_luego(clazz));
        }
    }

    puedoIgnorarLoQueEstaHaciendo(actor: Actor): boolean {
        return actor.comportamiento_actual &&
            actor.comportamiento_actual.some((comportamiento: Comportamiento) => this.debeIgnorarComportamiento(comportamiento))
    }

    debeIgnorarComportamiento(comportamiento: Comportamiento): boolean {
        return this.comportamientosQueNoMeColisionan().some((clazz: Function) => comportamiento.constructor == clazz)
    }

    abstract comportamientosQueNoMeColisionan(): Function[]

    abstract comportamientosQueProvoco(): Function[]

}