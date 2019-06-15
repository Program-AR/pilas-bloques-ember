/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "Interactuar.ts" />

class Encender extends Interactuar {

    public nombreAnimacion(): String {
        return "recoger"
    }

    protected alInteractuar(): void {
        this.interactuado().cargarAnimacion(this.nombreProximaAnimacion())
    }

    public nombreProximaAnimacion(): string {
        return "prendida"
    }

    configurarVerificaciones() {
        super.configurarVerificaciones()
        this.verificacionesPre.push(new Verificacion(() => this.estaApagada(), "¡Ya está " + this.nombreProximaAnimacion() + "!"))
    }

    estaApagada() {
        return this.interactuado().nombreAnimacionActual() != this.nombreProximaAnimacion()
    }

}