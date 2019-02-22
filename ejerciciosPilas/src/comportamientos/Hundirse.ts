/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts" />
/// <reference path = "ComportamientoAnimado.ts" />

class Hundirse extends Decir {
    postAnimacion() {
        this.receptor.eliminar();
    }
}