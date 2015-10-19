/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../actores/Hueso.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>


/**
 * @class SuperViaje
 *
 */
class SuperViaje extends Base {
    fondo;
    personaje;
    totalKM = 10;
    restantesKM;

    iniciar() {
        this.fondo = new Fondo('fondos.nubes.png',0,0);
        this.personaje = new PerroCohete(0,0);
        this.restantesKM = this.totalKM;
    }

    volarUnKM() {
        if (this.restantesKM == 0) {
            this.personaje.decir("¡Llegué!");
            return;
        }

        if (this.restantesKM == 1) {
            this.personaje.decir("¡Faltan 1 kilometro!");
        } else {
            this.personaje.decir("¡Faltan " + (this.restantesKM-1) + " kilometros!");
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
