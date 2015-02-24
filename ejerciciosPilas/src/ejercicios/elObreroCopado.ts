/// <reference path="../../dependencias/pilasweb.d.ts"/>

/**
 * @class ElObreroCopado
 * Es el ejercicio inicialr
 */
class ElObreroCopado extends Base {
    fondo;
    
    iniciar() {
        this.fondo = new Fondo('fondos/fondoObrero.png',0,0);
        new Mono(0,0);
      }
}