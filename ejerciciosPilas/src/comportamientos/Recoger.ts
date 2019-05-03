/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "Interactuar.ts" />

class Recolectar extends Interactuar {

    protected alInteractuar(): void {
        super.alInteractuar()
        this.interactuado().eliminar()
        if (this.argumentos['dondeReflejarValor']) {
            this.argumentos['dondeReflejarValor'].aumentar(1)
        }
    }

    nombreAnimacion() {
        return this.argumentos.nombreAnimacion || "recoger"
    }

}