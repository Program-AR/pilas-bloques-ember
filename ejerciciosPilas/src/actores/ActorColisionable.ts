/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="ActorAnimado.ts"/>

abstract class ActorColisionable extends ActorAnimado {

    pre_actualizar() {
        super.pre_actualizar();
        this.afecta().forEach(actor => this.provocarAlTocar(actor));
    }

    provocarAlTocar(actor) {
        if (this.colisiona_con_un_punto(actor.x, actor.y)) {
            this.provoca().forEach(comportamiento => actor.hacer_luego(comportamiento));
            this.provocaEnMi().forEach(comportamiento => this.hacer_luego(comportamiento));
        }
    }

    abstract afecta(): any[]

    abstract provoca(): any[];

    abstract provocaEnMi(): any[];

}