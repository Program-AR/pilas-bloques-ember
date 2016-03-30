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
		this.receptor.pizarra.linea(origen.x, origen.y, this.receptor.x, this.receptor.y, pilas.colores.negro, 6);
	}
}

class DibujarHaciaAdelante extends DibujarLinea {
	preAnimacion(){
		this.argumentos.direccion = new Direct(this.receptor.rotacion);
		super.preAnimacion();
	}
}