/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "Interactuar.ts" />

class Contar extends Interactuar {

    iniciar(receptor) {
        super.iniciar(receptor)
        if (!receptor[this.attrName()]) {
            receptor[this.attrName()] = new ObservadoConAumentar()
            receptor[this.attrName()].cantidad = 0
            receptor[this.attrName()].registrarObservador(this.receptor.escena.tableros[this.argumentos.etiqueta])
        }
    }

    protected alInteractuar(): void {
        this.receptor[this.attrName()].aumentar('cantidad', 1)
        if (this.argumentos.eliminar) this.interactuado().eliminar()
    }

    attrName() {
        return 'cant' + this.argumentos.etiqueta
    }

}