/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts" />
/// <reference path = "ComportamientoAnimado.ts" />

class Hundir extends ComportamientoAnimado {

    nombreAnimacion() {
        return "obstaculo";
    }

    preAnimacion() {
        this.receptor.decir("¡Me hundo!");
    }

    postAnimacion() {
        this.receptor.eliminar();
    }

}


