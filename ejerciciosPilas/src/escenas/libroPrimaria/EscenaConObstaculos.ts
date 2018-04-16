/// <reference path = "../EscenaActividad.ts" />
/// <reference path = "../../habilidades/Flotar.ts" />
/// <reference path = "../../actores/CuadriculaAutoLlenante.ts" />

/**
* @class EscenaConObstaculos
* Abstracta. Sirve para crear escenas con caminos a'la code.org.
* Al construirla, recibe una array de matrices, cada una de las cuales describe
* una disposición posible para el tablero.
*/
 class EscenaConObstaculos extends EscenaActividad {
	mapasEscena;
	premios;
	xFinal;
	yFinal;

	 constructor(mapasEscena, xFinal = false, yFinal = false){
		super();
		this.mapasEscena = mapasEscena;
		this.premios = [];
		this.xFinal = xFinal
		this.yFinal = yFinal;
	 }

	iniciar() {
		this.fondo = new Fondo(this.archivoFondo(),0,0);
		this.automata = this.crearAutomata();
		var mapaElegido = this.mapasEscena[Math.floor(Math.random() * this.mapasEscena.length)];
		this.cuadricula = new CuadriculaAutoLlenante(this.cuadriculaX(), this.cuadriculaY(), mapaElegido,
			{
				'A': (x,y) => this.automata,
				'O': (x,y) => new Obstaculo(this.archivosObstaculos(), (x+1)+(x+1)*(y+1)),
				'P': (x,y) => this.getPremio(),
			}, this.opsCuadricula(), this.opsCasilla());
		this.automata.enviarAlFrente();
		this.premios.forEach(premio => {
			premio.aprender(Flotar, {Desvio: 5});
		});
		if (this.mapasEscena.length > 1 ||
			this.mapasEscena[0].some(fila => fila.some(item => item.slice(-1) == '?'))
		) {
			new FlechaEscenarioAleatorio();
			console.log
		}
	}

	getPremio(){ // Lazy initializer
		let premio = this.premioBuscado();
		this.premios.push(premio);
		return premio;
	}

	estaResueltoElProblema(){
		return this.cantidadObjetosConEtiqueta(this.etiquetaPremio()) === 0 &&
			(this.xFinal === false || this.automata.casillaActual().sos(this.xFinal, this.yFinal));
	}

	crearAutomata() : ActorAnimado{
		//abstracto, retorna una nueva instancia del autómata.
		return new ActorAnimado(0,0,{});
	}

	archivoFondo(){
		//abstracto, retorna el nombre del archivo para el fondo.
	}

	archivosObstaculos(){
		//abstracto, retorna una lista de nombres de archivo de obstáculos con los que
		//se llenará la pantalla.
	}

	premioBuscado() : ActorAnimado{
		//abstracto, retorna una nueva instancia del premio a conseguir.
		return new ActorAnimado(0, 0, {});
	}

	etiquetaPremio() : String {
		// abstracto; devuelve la etiqueta que identifica el premio a conseguir
		return "";
	}

	cuadriculaX() {
		// abstracto; devuelve la posición X en que irá la cuadrícula
	}

	cuadriculaY() {
		// abstracto; devuelve la posición Y en que irá la cuadrícula
	}

	opsCuadricula() {
		// abstracto; devuelve las opciones para crear la cuadrícula
	}

	opsCasilla() {
		// abstracto; devuelve las opciones para las casillas de la cuadrícula
	}
}
