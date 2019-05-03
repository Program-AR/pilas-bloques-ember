/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path="../actores/ObservadoAnimado.ts"/>
/// <reference path = "../actores/ActorAnimado.ts" />
/// <reference path = "ComportamientoAnimado.ts" />
/// <reference path = "../escenas/EstadosDeEscena.ts" />

/**
 * Es un comportamiento genérico con la idea de ser extendido Sus características son:
 * - Si se está tocando con un objeto de etiqueta A: Realizar acciones dependientes de ese objeto.
 * - Caso Contrario: El personaje principal ejecuta un mensaje de error.
 * La escena que lo utiliza debe tener definido automata.
 * Respecto de los argumentos:
 *  - etiqueta: Es obligatorio, es la etiqueta del actor con el que busca interactuar.
 *  - mensajeError: Es el mensaje que aparece cuando no hay un actor con esa etiqueta.
 *  - animacionMientrasInteractua: Es la animación que se gatilla en el actor interactuado mientras se realiza la interacción.
 *  - animacionAlFinalizarInteraccion: Es la animación que se gatilla en el actor interactuado justo luego de terminar la interacción.
 *  - comportamientoAdicional y argumentosComportamiento: Es el comportamiento que se gatilla en el objeto colisionado justo luego de terminar
 * la interacción.
 * Este comportamiento finaliza, y el comportamiento adicional en el actor interactuado continúa.
*/
class InteractuarPorEtiqueta extends ComportamientoAnimado {

    public sanitizarArgumentos(): void {
        super.sanitizarArgumentos()

        if (!this.argumentos['etiqueta']) {
            throw new ArgumentError("Debe proveerse una etiqueta para verificar interacción")
        }
    }

    public configurarVerificaciones(): void {
        const mensajeError: string = this.argumentos['mensajeError'] || "¡Acá no hay " + this.argumentos['etiqueta'] + "!"
        this.verificacionesPre.push(new Verificacion(() => this.hayConQuienInteractuar(), mensajeError))
    }

    public preAnimacion(): void {
        super.preAnimacion()
        if (this.argumentos['animacionMientrasInteractua']) {
            this.interactuado().cargarAnimacion(this.argumentos['animacionMientrasInteractua'])
        }
    }

    public postAnimacion(): void {

        if (this.argumentos['animacionAlFinalizarInteraccion']) {
            this.interactuado().cargarAnimacion(this.argumentos['animacionAlFinalizarInteraccion'])
        }

        this.interactuar()
    }

	/**
	 * Indica si existe una posible interacción entre dos actores.
	 */
    public hayConQuienInteractuar(): boolean {
        return this.receptor.tocando(this.argumentos['etiqueta'])
    }

	/**
	 * Retorna al actor con el cual se realiza la interacción.
	 */
    public interactuado(): ActorAnimado {
        return this.receptor.objetoTocado(this.argumentos['etiqueta'])
    }

	/**
	 * Se llama al realizarse la interacción.
	 */
    protected alInteractuar(): void  {

    }

	/**
	 * Realiza la interacción.
	 */
    private interactuar(): void {

        if (this.argumentos['comportamientoAdicional']) {
            let claseComportamiento: any = window[this.argumentos['comportamientoAdicional']]

            this.interactuado().hacer_luego(claseComportamiento, this.argumentos['argumentosComportamiento'])
        }

        this.alInteractuar()

    }

}

class EncenderPorEtiqueta extends InteractuarPorEtiqueta {

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

class MorderPorEtiqueta extends EncenderPorEtiqueta {

    nombreProximaAnimacion() {
        return "mordida"
    }

}

class RecogerPorEtiqueta extends InteractuarPorEtiqueta {

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

class ContarPorEtiqueta extends InteractuarPorEtiqueta {

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