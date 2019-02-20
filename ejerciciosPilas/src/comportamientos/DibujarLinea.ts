/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>

// Está pensado para iniciar la línea en el centro del receptor.
// Esto hace que no haya que hacer cálculos ni aprender qué significa Shape.regX ó cómo lo usa pilas.
// Llámenme cobarde, sí. Perdón.
class DibujarLinea extends MovimientoAnimado {
	_hayObstaculo: boolean;

	iniciar(receptor){
		super.iniciar(receptor);
		if (!receptor.pizarra) receptor.pizarra = new pilas.actores.Pizarra();
	}

	darUnPaso(){
		var origen = { x: this.receptor.x, y: this.receptor.y };
		super.darUnPaso();
		if (!this.hayObstaculo()) {
			this.receptor.pizarra.linea(origen.x, origen.y, this.receptor.x, this.receptor.y, this.receptor.escena.colorDibujo(), 6);
		}
	}

	preAnimacion() {
		this.argumentos.distancia = this.argumentos.distancia || this.receptor.escena.longitudSegmento ;
		this.argumentos.distanciaConObstaculo = this.argumentos.distancia / 2;
		super.preAnimacion();
		if (this.argumentos.dibujarPuntos && !this.hayObstaculo()) {
			this.receptor.pizarra.dibujar_punto(this.receptor.x, this.receptor.y, this.receptor.escena.colorDibujo(), 6);
		}
	}

	postAnimacion() {
		super.postAnimacion();
		if (this.argumentos.dibujarPuntos) {
			this.receptor.pizarra.dibujar_punto(this.receptor.x, this.receptor.y, this.receptor.escena.colorDibujo(), 6);
		}
	}

	hayObstaculo(): boolean {
		if (this._hayObstaculo === undefined) {
			this._hayObstaculo = this.receptor.escena.obtenerActoresConEtiqueta("Charco").some(charco =>
				charco.colisiona_con_un_punto(this.puntoMedio().x, this.puntoMedio().y)
			);
		}
		return this._hayObstaculo; 
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
}

class DibujarHaciaAdelante extends DibujarLinea {
	preAnimacion(){
		this.argumentos.direccion = new Direct(this.receptor.rotacion);
		super.preAnimacion();
	}
}
