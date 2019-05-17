/// <reference path = "EscenaActividad.ts" />

class AlienLevantaTuercas extends EscenaActividad {
	cuadricula;
	fondo;

iniciar() {
		this.estado = new Estado(() => this.cantidadObjetosConEtiqueta('TuercaAnimada')==0);
		this.fondo = new pilas.fondos.Laberinto1();
		this.cuadricula = new Cuadricula(0,-25,5,6,
								{alto: 400},
								{grilla: 'invisible.png',
								cantColumnas: 1})
	  this.automata = new AlienAnimado(0,0);
		this.cuadricula.agregarActorEnPerspectiva(this.automata,4,0,false);
		for(var i = 0;i<5;i++){
			var tuerca = new TuercaAnimada(0,0);
			this.cuadricula.agregarActorEnPerspectiva(tuerca,i,i);
			//tuerca.aprender(Flotar,{'Desvio':10})
			//tuerca.aprender(RotarContinuamente,{'gradosDeAumentoStep':1})
			tuerca.aprender(Vibrar,{'gradosDeAumentoStep':2,'tiempoVibracion':40})

			tuerca.escala=1.0;
		}

}


moverIzquierda(){
	this.automata.hacer_luego(MoverACasillaIzquierda);

}

moverDerecha(){
	this.automata.hacer_luego(MoverACasillaDerecha);

}


	moverAbajo(){
		this.automata.hacer_luego(MoverACasillaAbajo);
	}

	moverArriba(){
		this.automata.hacer_luego(MoverACasillaArriba);

	}

	levantaTuerca(){
		this.automata.hacer_luego(Recolectar,{'etiqueta':'TuercaAnimada','mensajeError':'No hay una tuerca aquí'});

	}


}
