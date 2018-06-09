/// <reference path = "MovimientosEnCuadricula.ts"/>
/// <reference path = "../actores/libroPrimaria/Letra.ts" />

/**
 * Comportamiento que extiende un movimiento por la cuadrícula
 * con una lectura. El actor receptor debe tener definida la propiedad
 * 'cuadriculaSecundaria'. Si en la casilla de llegada hay un actor Letra,
 * su contenido se registra en la cuadrícula secundaria del receptor.
 */
class MovimientoConLectura extends MovimientoEnCuadricula {
    postAnimacion() {
        super.postAnimacion();
        let casilla = this.receptor.casillaActual();
        if (this.hayLetra(casilla)) {
            let caracter = this.caracterEnCasilla(casilla);
            let casillaLectura = this.receptor.cuadriculaSecundaria.proximaCasillaLibre();
            if (casillaLectura) {
                this.receptor.cuadriculaSecundaria.agregarActorEnProximaCasillaLibre(new LetraLeida(caracter));
            }
            else {
                throw new ActividadError("Ya leí mucho, ¡estoy cansado!");
            }
        }
    }

    hayLetra(casilla) {
        return casilla.tieneActorConEtiqueta('Letra');
    }

    caracterEnCasilla(casilla) {
        return casilla.actoresConEtiqueta('Letra')[0].caracter();
    }
}

class MoverLeyendoDerecha extends MovimientoConLectura {
    direccionCasilla = new DirCasillaDerecha();
}
class MoverLeyendoArriba extends MovimientoConLectura {
    direccionCasilla = new DirCasillaArriba();
}
class MoverLeyendoAbajo extends MovimientoConLectura {
    direccionCasilla = new DirCasillaAbajo();
}
class MoverLeyendoIzquierda extends MovimientoConLectura {
    direccionCasilla = new DirCasillaIzquierda();
}
