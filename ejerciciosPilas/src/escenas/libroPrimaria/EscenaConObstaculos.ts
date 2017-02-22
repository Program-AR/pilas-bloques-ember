/// <reference path = "../EscenaActividad.ts" />
/// <reference path = "../../habilidades/Flotar.ts" />
/// <reference path = "../../actores/CuadriculaAutoLlenante.ts" />

/**
* @class EscenaConObstaculos
* Abstracta. Sirve para crear escenas con caminos a'la code.org.
* Al construirla, recibe una matriz que describe el contenido.
*/
 class EscenaConObstaculos extends EscenaActividad {
	 mapaEscena;
	 premio;

	 constructor(mapaEscena){
		 super();
		 this.mapaEscena = mapaEscena;
	 }

	iniciar() {
		this.fondo = new Fondo(this.archivoFondo(),0,0);
		this.automata = this.crearAutomata();
		this.premio = this.premioBuscado();
		this.cuadricula = new CuadriculaAutoLlenante(0, 0, this.mapaEscena,
			{
				'A': () => this.automata,
				'O': () => new Obstaculo(this.archivosObstaculos()),
				'P': () => this.premio,
			}, {}, {grilla: 'invisible.png'});
		this.automata.enviarAlFrente();
		this.premio.aprender(Flotar,{Desvio:5});
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

	premioBuscado(){
		//abstracto, retorna una nueva instancia del premio a conseguir.
	}
}
