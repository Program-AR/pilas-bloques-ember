/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../../src/actores/ActorAnimado.ts"/>

abstract class Colisionar {

    teEstoyPorColisionar(actor: Actor): void {
        if (this.colisionaria(actor) && !this.deboIgnorarColision(actor)) {
            this.comportamientosQueProvoco().forEach((clazz: Function) => actor.hacer_luego(clazz));
        }
    }

    colisionaria(actor: Actor): boolean {
        return this.etiquetasDeLosActoresAfectados().some((etiqueta: string) => actor.tiene_etiqueta(etiqueta))
    }

    deboIgnorarColision(actor: Actor): boolean {
        return actor.comportamiento_actual &&
            actor.comportamiento_actual.some((comportamiento: Comportamiento) => this.debeIgnorarComportamiento(comportamiento))
    }

    debeIgnorarComportamiento(comportamiento: Comportamiento): boolean {
        return this.comportamientosQueNoMeColisionan().some((clazz: Function) => comportamiento.constructor == clazz)
    }

    abstract etiquetasDeLosActoresAfectados(): string[]

    abstract comportamientosQueNoMeColisionan(): Function[]

    abstract comportamientosQueProvoco(): Function[]

}