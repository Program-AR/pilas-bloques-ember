/// <reference path = "EscenaDesdeMapa.ts" />
/// <reference path = "../../habilidades/Flotar.ts" />
/// <reference path = "../../actores/libroPrimaria/Duba.ts" />
/// <reference path = "../../actores/libroPrimaria/Obstaculo.ts" />
/// <reference path = "../../actores/libroPrimaria/Churrasco.ts" />

class EscenaDuba extends EscenaDesdeMapa {
	automata: Duba;
	xFinal: number;
	yFinal: number;

	constructor(mapas: Array<MapaEscena>, xFinal = undefined, yFinal = undefined) {
		super(new GeneradorDeMapasArray(mapas));
		this.xFinal = xFinal;
		this.yFinal = yFinal;
	}
	
	ajustarGraficos() {
		this.automata.enviarAlFrente();
		this.automata.escala *= this.escalaSegunCuadricula(1.6);
		this.automata.setY(this.automata.getY() + this.automata.getAlto() / 8);

		this.obtenerActoresConEtiqueta("Churrasco").forEach(churrasco => {
			churrasco.aprender(Flotar, { Desvio: 5 });
			churrasco.escala *= this.escalaSegunCuadricula(1.2) * 0.85;
		});

		this.obtenerActoresConEtiqueta("Obstaculo").forEach(obstaculo => {
			obstaculo.escala *= this.escalaSegunCuadricula(1.1);
		});
	}

	mapeoCuadricula() : MapeoCuadricula {
		return {
			'A': () => this.automata,
			'O': (f : number, c : number) => this.obtenerObstaculo(f, c),
			'P': () => new Churrasco(),
		}
	}

	obtenerAutomata(): Duba {
		return new Duba;
	}

	obtenerObstaculo(fila: number, columna: number): Obstaculo {
		let archivosObstaculos = ["obstaculo.duba1.png", "obstaculo.duba2.png", "obstaculo.duba3.png", "obstaculo.duba4.png"];
		return new Obstaculo(archivosObstaculos, (fila + 1) + (fila + 1) * (columna + 1));
	}

	estaResueltoElProblema(): boolean {
		return (this.contarActoresConEtiqueta("Churrasco")) === 0 &&
			(this.xFinal === undefined || this.automata.casillaActual().sos(this.xFinal, this.yFinal));
	}

	archivoFondo() {
		return "fondo.duba.png";
	}
	cuadriculaX() {
		return 0;
	}
	cuadriculaY() {
		return -20;
	}
	opsCuadricula() {
		return { ancho: 340, alto: 380 };
	}
	opsCasilla() {
		return {
			grilla: 'casillas.duba.png',
			cantFilas: 1,
			cantColumnas: 16,
			bordesDecorados: true,
			relAspecto: 1,
		};
	}
}
