/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../personajes/Obrero.ts"/>

/**
 * @class ElObreroCopado
 * Es el ejercicio inicial
 */
class ElObreroCopado extends Base {
    fondo;
    obrero;
    
    iniciar() {
        this.fondo = new Fondo('fondos/fondoObrero.png',0,0);
        this.obrero = new Obrero(-160,-100);
        
//        this.obrero.hacer_luego(CaminaDerecha,{});
//        this.obrero.hacer_luego(CaminaDerecha,{});
//        this.obrero.hacer_luego(CaminaArriba,{});
//        this.obrero.hacer_luego(CaminaIzquierda,{});
      }
}