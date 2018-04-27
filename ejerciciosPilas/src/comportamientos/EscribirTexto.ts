/// <reference path = "SecuenciaAnimada.ts"/>
/// <reference path = "MovimientosEnCuadricula.ts"/>
/// <reference path = "EscribirLetra.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>

/**
 * Comportamiento que escribe una letra en la casilla actual.
 */
class EscribirTexto extends SecuenciaAnimada {
    iniciar(receptor: ActorAnimado){
        this.argumentos.secuencia = []
        // Por cada letra, debo moverme a la derecha y escribirla
        this.argumentos.texto.split("").forEach(caracter => {
            this.argumentos.secuencia.push(new EscribirLetra({caracter: caracter}));
            this.argumentos.secuencia.push(this.comportamientoMoverDerecha(receptor));
        });
        super.iniciar(receptor);
    }

    comportamientoMoverDerecha(receptor){
        return new MoverACasillaDerecha({
            velocidad: 40,
            verificacionesPre: [new Verificacion(() => receptor.casillaActual().hayDerecha(), "¡Estoy cansado! No quiero escribir más...")]
        });
    }
}