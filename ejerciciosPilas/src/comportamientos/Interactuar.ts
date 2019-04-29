/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts" />
/// <reference path = "../escenas/EstadosDeEscena.ts" />
/*
Es un comportamiento genérico con la idea de ser extendido
Sus características son
Si se está tocando con un objeto de etiqueta A:
	Realizar acciones dependientes de ese objeto
Caso Contrario:
	El personaje principal ejecuta un mensaje de error.
La escena que lo utiliza debe tener definido
automata
Respecto de los argumentos:
 - etiqueta: Es obligatorio, es la etiqueta del actor con el que busca condicional.
 - mensajeError: Es el mensaje que aparece cuando no hay colisión objeto de esa etiqueta.
 - animacionColisionadoPost: Es la animación que se gatilla en el objeto colisionado justo luego de terminar el comportamiento actual.
 - animacionColisionadoMientras: Es la animación que se gatilla en el objeto colisionado mientras se realiza el comportamiento actual.
 - comportamientoAdicional y argumentosComportamiento: Es el comportamiento que se gatilla
       en el objeto colisionado justo luego de terminar el comportamiento actual.
			 Este comportamiento finaliza, y el comportamiento adicional en el objeto colisionado continúa.
*/


abstract class Interactuar extends ComportamientoAnimado {

	public sanitizarArgumentos(): void {
		super.sanitizarArgumentos()

		if (!this.argumentos['etiqueta']) {
			throw new ArgumentError("Debe proveerse una etiqueta para verificar colisión")
		}
	}

	public configurarVerificaciones(): void {
		var mensajeError = this.argumentos['mensajeError'] || "¡Acá no hay " + this.hacerLegible(this.argumentos['etiqueta']) + "!"
		this.verificacionesPre.push(new Verificacion(() => this.estaInteractuando(), mensajeError))
	}

	public estaInteractuando(): boolean {
		return this.receptor.tocando(this.argumentos['etiqueta'])
	}

	public interactuado(): ActorAnimado {
		return this.receptor.objetoTocado(this.argumentos['etiqueta'])
	}

	protected hacerLegible(etiqueta: String): String {
		return etiqueta.toLowerCase().split("animada")[0].split("animado")[0]
	}

	public preAnimacion(): void {
		super.preAnimacion()
		if (this.argumentos['animacionColisionadoMientras']) this.interactuado().cargarAnimacion(this.argumentos['animacionColisionadoMientras'])
	}

	public postAnimacion(): void {
		var interactuado: ActorAnimado = this.interactuado()

		if (this.argumentos['animacionColisionadoPost']) {
			interactuado.cargarAnimacion(this.argumentos['animacionColisionadoPost'])
		}

		if (this.argumentos['comportamientoAdicional']) {
			let claseComportamiento: any = window[this.argumentos['comportamientoAdicional']]

			interactuado.hacer_luego(claseComportamiento, this.argumentos['argumentosComportamiento'])
		}

		this.alInteractuar(interactuado)
	}

	protected abstract alInteractuar(actor: ActorAnimado): void

}

class DesencadenarComportamientoSiColisiona extends Interactuar {

	protected alInteractuar(actor: ActorAnimado): void {
		actor.hacer_luego(window[this.argumentos['comportamiento']], this.argumentos['argumentosComportamiento'])
	}

}

class EncenderPorEtiqueta extends Interactuar {

	public nombreAnimacion(): String {
		return "recoger"
	}

	protected alInteractuar(actor: ActorAnimado): void {
		actor.cargarAnimacion(this.nombreProximaAnimacion())
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