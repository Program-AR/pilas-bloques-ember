/// <reference path = "EscenaActividad.ts" />
/// <reference path = "Errores.ts" />
/// <reference path = "../actores/FondoAnimado.ts"/>
/// <reference path = "../actores/Superheroe.ts"/>


/**
 * @class SuperViaje
 *
 */
class SuperViaje extends EscenaActividad {
    fondo;
    automata;

    iniciar() {
        this.fondo = new FondoAnimado('fondo.elSuperviaje.png', pilas.derecha(), 0);
        this.automata = new Superheroe();
        this.automata.aprender(Flotar,{Desvio:  10});

        this.automata.totalKM = 50 + Math.round(Math.random() * 150);
        this.automata.restantesKM = this.automata.totalKM;

        this.automata.kmsTotales = function(){
          return this.totalKM
        };

        this.automata.fraseAlVolar = function() {
          this.restantesKM--;
          if (this.restantesKM == 0) return "¡Llegué!";
          if (this.restantesKM == 1) return "¡Falta 1 kilometro!";
          if (this.restantesKM < 0) throw new ActividadError("¡Volé de más!");

          return "¡Faltan " + this.restantesKM + " kilometros!";
        }
    }
}
