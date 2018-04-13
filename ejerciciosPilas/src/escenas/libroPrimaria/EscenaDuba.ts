/// <reference path = "EscenaConObstaculos.ts" />
/// <reference path = "../../actores/libroPrimaria/Duba.ts" />
/// <reference path = "../../actores/libroPrimaria/Churrasco.ts" />

 class EscenaDuba extends EscenaConObstaculos {
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
		return {ancho: 300, alto: 300};
	}
	opsCasilla() {
		return {grilla: 'invisible.png'};
	}
}
