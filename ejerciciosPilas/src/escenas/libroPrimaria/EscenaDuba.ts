/// <reference path = "EscenaConObstaculos.ts" />
/// <reference path = "../../actores/libroPrimaria/Duba.ts" />
/// <reference path = "../../actores/libroPrimaria/Churrasco.ts" />

 class EscenaDuba extends EscenaConObstaculos {

	iniciar(){
		super.iniciar();
		this.automata.escala *= this.escalaSegunCuadricula(1.6);
		this.automata.setY(this.automata.getY() + this.automata.getAlto() / 8);
		this.premios.forEach(premio => {
			premio.escala *= this.escalaSegunCuadricula(1.2) * 0.85;			
		});
		pilas.obtener_actores_con_etiqueta('Obstaculo').forEach(obstaculo => {
			obstaculo.escala *= this.escalaSegunCuadricula(1.1);
		});
	}
	crearAutomata(){
		return new Duba();
	}
	archivosObstaculos(){
		return ["obstaculo.duba1.png", "obstaculo.duba2.png", "obstaculo.duba3.png", "obstaculo.duba4.png"];
	}
	archivoFondo(){
		return "fondo.duba.png";
	}
	premioBuscado(){
		return new Churrasco();
	}
	etiquetaPremio() {
		return "Churrasco";
	}
	cuadriculaX() {
		return 0;
	}
	cuadriculaY() {
		return -20;
	}
	opsCuadricula() {
		return {ancho: 340, alto: 380};
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
