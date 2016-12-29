/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Obrero.ts"/>
/// <reference path = "../habilidades/AvisaAlSalirDePantalla.ts"/>
/// <reference path = "../comportamientos/Martillar.ts"/>

/**
 * @class ElObreroCopado
 *
 * Objetivos: Introducir Secuencia. Autómata, y procedimiento.
 */
class ElObreroCopado extends EscenaActividad {
    fondo;
    obrero;
    automata;

    iniciar() {
        this.fondo = new Fondo('fondos.obrero.png',0,0);
        this.obrero = new Obrero(160,-100);
        //this.obrero.aprender(AvisaAlSalirDePantalla,{});
        this.automata = this.obrero;
    }

/*************** Métodos para que se cuelgue blockly ****************/
/****** Deben tener sólo una línea, que sea un "hacer_luego" ********/
/****** El nombre debe ser el que tendrá el bloque en blockly *******/

    avanzar(){
        this.obrero.hacer_luego(CaminaIzquierda, {pasos: 2});
    }

    retroceder(){
        this.obrero.hacer_luego(CaminaDerecha, {pasos: 2});
    }

    martillar(){
        this.obrero.hacer_luego(Martillar, {veces: 20});
    }

    saltar(){
        this.obrero.hacer_luego(Saltar);
    }
}
