/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="ActorAnimado.ts"/>

class ActorColisionable extends ActorAnimado {

    colisionoPreviamente = false;

    pre_actualizar() {
        super.pre_actualizar();
        this.actoresQueAfecta().forEach(actor => this.provocarAlTocar(actor));
    }

    provocarAlTocar(actor) {
        if (!this.colisionoPreviamente && !this.deboIgnorarColision(actor) && this.colisiona_con_un_punto(actor.x, actor.y)) {
            this.provoca().forEach(comportamiento => actor.hacer_luego(comportamiento));
            this.colisionoPreviamente = true;
        }
    }

    actoresQueAfecta() {
        return this.afecta().map(actor =>
            pilas.obtener_actores_en_la_escena().filter(actorEnEscena => actorEnEscena instanceof actor))
            .reduce((unosActores, otrosActores) => unosActores.concat(otrosActores));
    }

    deboIgnorarColision(actor): boolean {
        return actor.comportamiento_actual &&
            actor.comportamiento_actual.some(comportamiento => this.debeIgnorarComportamiento(comportamiento))
    }

    debeIgnorarComportamiento(comportamiento): boolean {
        return this.ignora().some(comportamientoAIgnorar => comportamiento instanceof comportamientoAIgnorar);
    }

    afecta() {
        return [];
    };

    ignora() {
        return [];
    };

    provoca() {
        return [];
    };

}