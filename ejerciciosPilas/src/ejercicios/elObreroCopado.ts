/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../personajes/Obrero.ts"/>
/// <reference path = "../comportamientos/movimientosLibres.ts"/>

/**
 * @class ElObreroCopado
 * 
 * Objetivos: Introducir Secuencia. Autómata.
 * Enunciado: Que haga una historia con el obrero. Avanzar dos veces, martillar, volver.
 */
class ElObreroCopado extends Base {
    fondo;
    obrero;
    
    iniciar() {
        this.fondo = new Fondo('fondos/fondoObrero.png',0,0);
        this.obrero = new Obrero(-160,-100);
        
      }

/*************** Métodos para que se cuelgue blockly ****************/
/****** Deben tener sólo una línea, que sea un "hacer_luego" ********/
/****** El nombre debe ser el que tendrá el bloque en blockly *******/  
    
    avanzar(){
        this.obrero.hacer_luego(CaminaDerechaSinPasarse,{pasos: 2});
    }
    
    retroceder(){
        this.obrero.hacer_luego(CaminaIzquierdaSinPasarse,{pasos: 2});
    }
    
    martillar(){
        this.obrero.martillar();
    }
}