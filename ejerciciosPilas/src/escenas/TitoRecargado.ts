/// <reference path = "SuperTito2.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path = "../comportamientos/ComportamientoColision.ts" />

/**
 * @class TitoRecargado
 *
 */
class TitoRecargado extends SuperTito2 {
    pathFondo() {
        return 'fondos.estrellas.png';
    }

    cantidadFilas(){
        return 7;
    }   

    avanzar() {
        this.automata.hacer_luego(MoverACasillaDerecha);
    }

    prenderLuz() {
        this.automata.hacer_luego(EncenderPorEtiqueta, { etiqueta: 'Luz' });
    }

}
