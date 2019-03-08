/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../../src/actores/ActorAnimado.ts"/>

abstract class Colisionar {

    teEstoyPorColisionar(actor): void {
        if (this.participaraEnLaColision(actor) && !this.deboIgnorarColision(actor)) {
            this.comportamientosQueProvoca().forEach(comportamiento => actor.hacer_luego(comportamiento));
        }
    }

    participaraEnLaColision(actor): boolean {
        return this.etiquetasDeLosActoresAfectados().some(etiqueta => actor.tiene_etiqueta(etiqueta))
    }

    deboIgnorarColision(actor): boolean {
        return actor.comportamiento_actual &&
            actor.comportamiento_actual.some(comportamiento => this.debeIgnorarComportamiento(comportamiento))
    }

    debeIgnorarComportamiento(comportamiento): boolean {
        return this.comportamientosAIgnorar().some(comportamientoAIgnorar => comportamiento instanceof comportamientoAIgnorar)
    }

    abstract etiquetasDeLosActoresAfectados()

    abstract comportamientosAIgnorar()

    abstract comportamientosQueProvoca()

}