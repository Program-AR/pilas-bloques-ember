/// <reference path = "EscenaConObstaculos.ts" />
/// <reference path = "../../actores/libroPrimaria/Duba.ts" />
/// <reference path = "../../actores/libroPrimaria/Churrasco.ts" />

 class EscenaDuba extends EscenaConObstaculos {

	iniciar(){
		super.iniciar();
		this.automata.escala *= 1.5;
		this.automata.setY(this.automata.getY() + this.automata.getAlto() / 4);
		pilas.obtener_actores_con_etiqueta('Obstaculo').forEach(obstaculo => {
			obstaculo.escala *= 1.2;
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
		return {ancho: 300, alto: 300};
	}
	opsCasilla() {
		return {grilla: 'invisible.png'};
	}
}
