/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="ActorAnimado.ts"/>

class ActorColisionable {

    teEstoyPorColisionar(actor): void {
        if (this.participaraEnLaColision(actor) && !this.deboIgnorarColision(actor)) {
            this.ComportamientosQueProvoca().forEach(comportamiento => actor.hacer_luego(comportamiento));
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

    etiquetasDeLosActoresAfectados(): String[] {
        return []
    };

    comportamientosAIgnorar() {
        return []
    };

    ComportamientosQueProvoca() {
        return []
    };

}