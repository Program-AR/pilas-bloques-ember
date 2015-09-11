class AlienLevantaTuercas extends Base {
	automata;
	estado;
	cuadricula;
	fondo;

iniciar() {
		this.estado=undefined;
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
			//tuerca.aprender(Rotar,{'gradosDeAumentoStep':1})
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
		this.automata.hacer_luego(RecogerPorEtiqueta,{'etiqueta':'TuercaAnimada','mensajeError':'No hay una tuerca aquí'});

	}


}
































/*



function convertir_posicion_a_coordenada(fila, columna) {



	var columnas = [-175, -105, -35, 35, 105, 175];
	var filas = [140, 60, -20, -100, -180];

	return {x: columnas[columna-1], y: filas[fila-1]};
}

class AlienLevantaTuercas extends Base {

    iniciar(){
	    var fondo = new pilas.fondos.Laberinto1();
	    var alien = new pilas.actores.Alien(-175, -180);

	    alien.cuando_busca_recoger = function() {
	      var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca')

	      if (actores.length > 0) {
	        var mensaje = "";
	        actores[0].eliminar();
	        var restantes = pilas.obtener_actores_con_etiqueta("Tuerca").length;

	        if (restantes > 0)
	          mensaje = "genial, aún quedan: " + restantes;
	        else
	          mensaje = "¡Nivel completado!"

	        alien.decir(mensaje);
	        console.log(mensaje);
	      }
	    }


	    var posicion = convertir_posicion_a_coordenada(1, 1);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

	    var posicion = convertir_posicion_a_coordenada(3, 2);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

	    var posicion = convertir_posicion_a_coordenada(5, 3);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

	    var posicion = convertir_posicion_a_coordenada(3, 6);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

	    //window.tuerca = tuerca;
    }

}
*/
