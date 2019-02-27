/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="ActorAnimado.ts"/>

abstract class ActorColisionable extends ActorAnimado {

    pre_actualizar() {
        super.pre_actualizar();
        const automata = pilas.obtener_actores_con_etiqueta("Automata")[0];

        if (automata && this.colisiona_con_un_punto(automata.x, automata.y)) {
            this.provocarEnAutomata().forEach(comportamiento => automata.hacer_luego(comportamiento));
            this.provocarEnMi().forEach(comportamiento => this.hacer_luego(comportamiento));
        }
    }

    abstract provocarEnAutomata(): any[];

    abstract provocarEnMi(): any[];

}