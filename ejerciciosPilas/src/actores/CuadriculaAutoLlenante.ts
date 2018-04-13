/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Casilla.ts"/>

/**
 * class @CuadriculaAutoLlenante
 *
 * Este actor sirve para dibujar una cuadrícula en pantalla, llenándola de elementos
 * a partir de una matriz que la describe.
 * Se pensó originalmente para realizar un camino
 * al estilo de las actividades iniciales de code.org, con varios obstáculos.
 *
 * La matrizContenido en el constructor es una matriz de 2 dimensiones.
 * Cada contenido puede ser un string, que es el identificador del actor que irá en cada casilla.
 * Por ejemplo se puede usar una letra 'A' para identificar al autómata.
 * Los strings vacíos y el caracter espacio ' ' significa "casilla libre".
 * Si el string finaliza en un signo de interrogación ('?'),
 * el actor se colocará con una probabilidad de 0.5.

 * El diccionarioContenido mapea cada identificador con la función que obtiene a cada actor.
 * Importante: el actor debe crearse AL LLAMAR A ESA FUNCION, y no antes.
 *
 *
*/

class CuadriculaAutoLlenante extends Cuadricula {
	matrizContenido;
	diccionarioContenido;

	constructor(x, y, matrizContenido, diccionarioContenido, opsCuadricula, opsCasilla){
		this.matrizContenido = matrizContenido;
		this.diccionarioContenido = diccionarioContenido;
		super(x, y, matrizContenido.length, matrizContenido[0].length, opsCuadricula, opsCasilla);
	}

	agregarCasilla(nroFila,nroColumna){
		super.agregarCasilla(nroFila,nroColumna);
		var codigo = this.matrizContenido[nroFila][nroColumna];
		if (codigo !== '' && codigo != ' ') { // si no es casilla libre
			if (codigo.slice(-1) == '?') { // si debe ser randomizado 
				if (Math.random() < .5) {
					this.agregarActor(this.diccionarioContenido[codigo.slice(0,-1)](),nroFila,nroColumna,true);
				}
			} else {
				this.agregarActor(this.diccionarioContenido[codigo](),nroFila,nroColumna,true);
			}
		}
	}
}
