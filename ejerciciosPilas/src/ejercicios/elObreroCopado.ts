/// <reference path="../../../pilasweb/src/escenas.ts"/>

/**
 * @class ElObreroCopado
 * Es el ejercicio inicial
 */
class ElObreroCopado extends Base {
    fondo;
    pilas;
    
    constructor(pila){
        super();
        pilas = pila;
    }
    
    iniciar() {
        super.iniciar();
        this.fondo = new pilas.fondos.Fondo();
        fondo.imagen = 'fondos/fondoObrero.png';
        new pilas.actores.Mono();
      }
}