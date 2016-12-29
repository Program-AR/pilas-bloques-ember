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

        this.automata.totalKM = 15 + Math.round(Math.random() * 30);
        this.automata.restantesKM = this.automata.totalKM;

        this.automata.kmsTotales = function(){
          return this.totalKM
        };

        this.crearTablero();

        this.automata.fraseAlVolar = function() {
          this.restantesKM--;
          if (this.restantesKM == 0) return "¡Llegué!";
          if (this.restantesKM == 1) return "¡Falta 1 kilometro!";
          if (this.restantesKM < 0) throw new ActividadError("Ya llegué, ¡no debo seguir volando!");

          return "¡Faltan " + this.restantesKM + " kilometros!";
        }
    }

    crearTablero(){
      Trait.toObject(Observado, this.automata);
      var tablero = new Tablero(0, 210, { texto: "Kilómetros a recorrer" , atributoObservado: 'kmsTotales'});
      this.automata.registrarObservador(tablero);
    }

    estaResueltoElProblema(){
      return this.automata.restantesKM === 0;
    }

}
