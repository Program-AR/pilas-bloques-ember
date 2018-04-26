/// <reference path = "SecuenciaAnimada.ts"/>
/// <reference path = "MovimientosEnCuadricula.ts"/>
/// <reference path = "EscribirLetra.ts"/>

/**
 * Comportamiento que escribe una letra en la casilla actual.
 */
class EscribirTexto extends SecuenciaAnimada {
    iniciar(receptor){
        this.argumentos.secuencia = []
        // Por cada letra, debo moverme a la derecha y escribirla
        this.argumentos.texto.split("").forEach(caracter => {
            this.argumentos.secuencia.push(new MoverACasillaDerecha({}));
            this.argumentos.secuencia.push(new EscribirLetra({caracter: caracter}));
        });
        super.iniciar(receptor);
    }
}