/// <reference path = "EscenaDesdeMapa.ts" />
/// <reference path = "../../actores/libroPrimaria/Lita.ts" />
/// <reference path = "../../actores/libroPrimaria/Obstaculo.ts" />
/// <reference path = "../../actores/libroPrimaria/Ensalada.ts" />

class EscenaLita extends EscenaDesdeMapa {
    automata : Lita;

    constructor(mapas: Array<MapaEscena>) {
        super(new GeneradorDeMapasArray(mapas));
    }

    mapeoCuadricula() : MapeoCuadricula {
        return {
            'A': () => this.automata,
            'L': () => new Lechuga(),
            'T': () => new Tomate(),
            'E': () => new Ensaladera(),
            'O': (f, c) => this.obtenerObstaculo(f,c)
        }
    }

    obtenerAutomata() : Lita {
        return new Lita();
    }
    
    obtenerObstaculo(fila: number, columna: number): Obstaculo {
		let archivosObstaculos = ["obstaculo.lita1.png", "obstaculo.lita2.png", "obstaculo.lita3.png", "obstaculo.lita4.png"];
		return new Obstaculo(archivosObstaculos, (fila + 1) + (fila + 1) * (columna + 1));
    }

    archivoFondo() {
        return "fondo.lita.png";
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
