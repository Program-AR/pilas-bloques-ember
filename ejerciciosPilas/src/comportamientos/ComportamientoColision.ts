/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts" />
/// <reference path = "../escenas/EstadosDeEscena.ts" />
/*
Es un comportamiento genérico con la idea de ser extendido
Sus características son

Si se está colisionando con un objeto de etiqueta A:
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


class ComportamientoColision extends ComportamientoAnimado {

	sanitizarArgumentos() {
		super.sanitizarArgumentos();

		if (!this.argumentos['etiqueta']) {
			throw new ArgumentError("Debe proveerse una etiqueta para verificar colisión");
		}
	}

	configurarVerificaciones() {
		var mensajeError = this.argumentos['mensajeError'] || "¡Acá no hay " + this.hacerLegible(this.argumentos['etiqueta']) + "!";
		this.verificacionesPre.push(new Verificacion(() => this.colisiona(), mensajeError));
	}

	postAnimacion() {
		var objetoTocado = this.objetoTocado();

		if (this.argumentos['animacionColisionadoPost']) {
			objetoTocado.cargarAnimacion(this.argumentos['animacionColisionadoPost']);
		}

		if (this.argumentos['comportamientoAdicional']) {
			let claseComportamiento: any = window[this.argumentos['comportamientoAdicional']];

			objetoTocado.hacer_luego(claseComportamiento, this.argumentos['argumentosComportamiento']);
		}

		this.metodo(objetoTocado);
	}

	preAnimacion() {
		super.preAnimacion();
		if (this.argumentos['animacionColisionadoMientras']) this.objetoTocado().cargarAnimacion(this.argumentos['animacionColisionadoMientras']);
	}

	colisiona() {
		return this.receptor.tocando(this.argumentos['etiqueta']);
	}

	objetoTocado() {
		return this.receptor.objetoTocado(this.argumentos['etiqueta']);
	}

	hacerLegible(etiqueta) {
		return etiqueta.toLowerCase().split("animada")[0].split("animado")[0];
	}

	metodo(objetoColision) {
		//redefinir por subclase
	}
}

class DesencadenarComportamientoSiColisiona extends ComportamientoColision {
	metodo(objetoColision) {
		let claseComportamiento: any = window[this.argumentos['comportamiento']];

		objetoColision.hacer_luego(claseComportamiento, this.argumentos['argumentosComportamiento'])
	}
}

class EncenderPorEtiqueta extends ComportamientoColision {
	nombreAnimacion() {
		return "recoger";
	}
	metodo(objetoColision) {
		objetoColision.cargarAnimacion(this.nombreProximaAnimacion());
	}
	nombreProximaAnimacion() {
		return "prendida"
	}
	configurarVerificaciones() {
		super.configurarVerificaciones();
		this.verificacionesPre.push(new Verificacion(() => this.estaApagada(), "¡Ya está " + this.nombreProximaAnimacion() + "!"));
	}
	estaApagada() {
		return this.objetoTocado().nombreAnimacionActual() != this.nombreProximaAnimacion();
	}
}

class MorderPorEtiqueta extends EncenderPorEtiqueta {
	nombreProximaAnimacion() {
		return "mordida";
	}
}

class PrenderComputadora extends ComportamientoColision {

	configurarVerificaciones(): void {
		super.configurarVerificaciones();
		this.verificacionesPre.push(new Verificacion(() => !this.objetoTocado().yaFuePrendida,
			"Esta compu ya la prendiste antes"))
	}

}

class ApagarComputadora extends ComportamientoColision {

	configurarVerificaciones(): void {
		super.configurarVerificaciones();
		this.verificacionesPre.push(new Verificacion(() => this.objetoTocado().yaFuePrendida,
			"Esta compu ya la apagaste antes"))
	}

}

class EscribirEnCompuAnimada extends ComportamientoColision {
	iniciar(receptor) {
		this.argumentos.etiqueta = "CompuAnimada";
		this.argumentos.mensajeError = "No hay una compu aqui";
		this.argumentos.nombreAnimacion = "escribir";
		super.iniciar(receptor);
	}

	metodo(objetoColision) {
		if (this.argumentos['idTransicion'] == 'escribirC') {
			objetoColision.cargarAnimacion("claveok");
		}
	}
}