/// <reference path = "ComportamientoConVelocidad.ts" />
/// <reference path = "GirarMarquesina.ts" />

class VolarHeroicamente extends ComportamientoConVelocidad {
	nombreAnimacion(){
		return 'correr';
	}

	preAnimacion(){
			this.argumentos.velocidad = 100;
			this.argumentos.cantPasos = 1;
			super.preAnimacion();
	    this.receptor.escena.fondo.hacer_luego(GirarMarquesina,{});
	}

	postAnimacion(){
		super.postAnimacion();
		if(this.receptor.fraseAlVolar) this.receptor.decir(this.receptor.fraseAlVolar());
	}
}
