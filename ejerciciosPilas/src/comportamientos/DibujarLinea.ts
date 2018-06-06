/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>

// Está pensado para iniciar la línea en el centro del receptor.
// Esto hace que no haya que hacer cálculos ni aprender qué significa Shape.regX ó cómo lo usa pilas.
// Llámenme cobarde, sí. Perdón.
class DibujarLinea extends MovimientoAnimado {
	iniciar(receptor){
		super.iniciar(receptor);
		if (!receptor.pizarra) receptor.pizarra = new pilas.actores.Pizarra();
	}

	darUnPaso(){
		var origen = { x: this.receptor.x, y: this.receptor.y };
		super.darUnPaso();
		this.receptor.pizarra.linea(origen.x, origen.y, this.receptor.x, this.receptor.y, pilas.colores.azuloscuro, 6);
	}

	preAnimacion() {
		super.preAnimacion();
		if (this.argumentos.dibujarPuntos) {
			this.receptor.pizarra.dibujar_punto(this.receptor.x, this.receptor.y, pilas.colores.azuloscuro, 6);
		}
	}

	postAnimacion() {
		super.postAnimacion();
		if (this.argumentos.dibujarPuntos) {
			this.receptor.pizarra.dibujar_punto(this.receptor.x, this.receptor.y, pilas.colores.azuloscuro, 6);
		}
	}
}

class DibujarHaciaAdelante extends DibujarLinea {
	preAnimacion(){
		this.argumentos.direccion = new Direct(this.receptor.rotacion);
		this.argumentos.distancia = this.receptor.escena.longitudSegmento || this.argumentos.distancia;
		super.preAnimacion();
	}
}

class DibujarHaciaArriba extends DibujarLinea {
	preAnimacion(){
		this.argumentos.direccion = new Direct(0,1);
		this.argumentos.distancia = this.receptor.escena.longitudSegmento || this.argumentos.distancia;
		super.preAnimacion();
	}
}

class DibujarHaciaAbajo extends DibujarLinea {
	preAnimacion(){
		this.argumentos.direccion = new Direct(0,-1);
		this.argumentos.distancia = this.receptor.escena.longitudSegmento || this.argumentos.distancia;
		super.preAnimacion();
	}
}

class DibujarHaciaLaDerecha extends DibujarLinea {
	preAnimacion(){
		this.argumentos.direccion = new Direct(1,0);
		this.argumentos.distancia = this.receptor.escena.longitudSegmento || this.argumentos.distancia;
		super.preAnimacion();
	}
}

class DibujarHaciaLaIzquierda extends DibujarLinea {
	preAnimacion(){
		this.argumentos.direccion = new Direct(-1,0);
		super.preAnimacion();
	}
}
