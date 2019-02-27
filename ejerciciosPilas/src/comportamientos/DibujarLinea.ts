/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>

// Está pensado para iniciar la línea en el centro del receptor.
// Esto hace que no haya que hacer cálculos ni aprender qué significa Shape.regX ó cómo lo usa pilas.
// Llámenme cobarde, sí. Perdón.
class DibujarLinea extends MovimientoAnimado {

	iniciar(receptor) {
		super.iniciar(receptor);
		if (!receptor.pizarra) receptor.pizarra = new pilas.actores.Pizarra();
	}

	darUnPaso() {
		const { x, y } = { x: this.receptor.x, y: this.receptor.y };
		super.darUnPaso();
		this.dibujarLinea(x, y);
	}

	dibujarLinea(x: number, y: number) {
		if (!this.hayObstaculo()) {
			this.receptor.pizarra.linea(x, y, this.receptor.x, this.receptor.y, this.receptor.escena.colorDibujo(), 6);
		}
	}

	dibujarPunto() {
		if (this.argumentos.dibujarPuntos && !this.hayObstaculo()) {
			this.receptor.pizarra.dibujar_punto(this.receptor.x, this.receptor.y, this.receptor.escena.colorDibujo(), 6);
		}
	}

	preAnimacion() {
		this.argumentos.distancia = this.argumentos.distancia || this.receptor.escena.longitudSegmento;
		this.argumentos.distanciaConObstaculo = this.argumentos.distancia / 2;
		super.preAnimacion();
		this.dibujarPunto();
	}

	postAnimacion() {
		super.postAnimacion();
		this.dibujarPunto();
	}

	hayObstaculo(): boolean {
		return this.receptor.escena.obtenerActoresConEtiqueta("Charco").some(charco =>
			charco.colisiona_con_un_punto(this.puntoMedio().x, this.puntoMedio().y));
	}

	/**
	 * Punto medio entre la posición actual del actor que realiza el comportamiento
	 * y el destino del movimiento.
	 */
	puntoMedio(): PuntoSimple {
		return {
			x: (this.destino().x + this.receptor.x) / 2,
			y: (this.destino().y + this.receptor.y) / 2
		};
	}

	/**
	 * Redefino el metodo dejandolo vacio para evitar
	 * que se utilicen las validaciones de colision heredadas.
	 */
	configurarVerificaciones(): void {

	}
}

class DibujarHaciaAdelante extends DibujarLinea {
	preAnimacion() {
		this.argumentos.direccion = new Direct(this.receptor.rotacion);
		super.preAnimacion();
	}
}
