/// <reference path = "SuperTito2.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>

/**
 * @class TitoRecargado
 *
 */
class TitoRecargado extends SuperTito2 {
    static pathFondo() {
        return 'fondos.estrellas.png';
    }

    cantidadFilas() {
        return 7;
    }

    avanzar() {
        this.automata.hacer_luego(MoverACasillaDerecha);
    }

    prenderLuz() {
        this.automata.hacer_luego(Encender, { etiqueta: 'Luz' });
    }

}
