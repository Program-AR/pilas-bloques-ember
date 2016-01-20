/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../actores/Hueso.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path = "../actores/FondoAnimado.ts"/>


/**
 * @class SuperViaje
 *
 */
class SuperViaje extends EscenaActividad {
    fondo;
    automata;
    totalKM = 10;
    restantesKM;

    iniciar() {
        this.fondo = new FondoAnimado('fondo.elSuperviaje.png', pilas.derecha, 0);
        this.automata = new PerroCohete(0,0);
        this.restantesKM = this.totalKM;
    }

    volarUnKM() {
        if (this.restantesKM == 0) {
            this.automata.decir("¡Llegué!");
            return;
        }

        if (this.restantesKM == 1) {
            this.automata.decir("¡Faltan 1 kilometro!");
        } else {
            this.automata.decir("¡Faltan " + (this.restantesKM - 1) + " kilometros!");
        }
        this.restantesKM--;
    }

    getKMFaltantes() {
        return this.totalKM;
    }

    setKMFaltantes(valor) {
        this.totalKM = valor;
    }
}
