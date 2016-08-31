/// <reference path = "MovimientoAnimado.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>


class GirarMarquesina extends MovimientoAnimado {
	posInicial;

	preAnimacion() {
		this.argumentos.distancia = this.receptor.subactores[0].getAncho();
		this.argumentos.direccion = new Direct(-1, 0);
		this.argumentos.voltearAlIrAIzquierda = false;

		this.posInicial = { x: this.receptor.subactores[0].x, y: this.receptor.subactores[0].y };

		if(!this.receptor.subactores[1]){
			this.receptor.agregarSubactor(this.espejo());
		} else {
			this.receptor.subactores[1].x = this.posInicial.x + this.receptor.subactores[0].getAncho()
		};
		
		super.preAnimacion();
	}

	postAnimacion(){
		super.postAnimacion();
		this.receptor.setX(this.posInicial.x);
	}

	espejo(){
		var clon = new ActorAnimado(
			this.posInicial.x + this.receptor.subactores[0].getAncho(),
			this.posInicial.y,
			this.receptor.subactores[0].opciones);
		clon.z = this.receptor.subactores[0].z;
		return clon;
	}
}
