/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../comportamientos/SaltarHablando.ts" />


/**
 * @class NoMeCansoDeSaltar
 *
 * Objetivos: Introducir Repetición
 * Enunciado: Repetir salto.
 */
 class NoMeCansoDeSaltar extends EscenaActividad {
   automata
   fondo
   saltosFaltantes;


 	iniciar() {
        this.fondo = new Fondo('fondo.noMeCansoDeSaltar.png',0,0);
        this.automata = new GatoAnimado(0,-150);
        this.saltosFaltantes=30;
        }

  s(){
      this.automata.hacer_luego(SaltarHablando,{});
    }

    fraseAlSaltar(){
      this.saltosFaltantes--;
      if (this.saltosFaltantes > 0)  return "Faltan " + this.saltosFaltantes + " saltos";
      if (this.saltosFaltantes == 0) return "¡Ya salté todo lo necesario!";
      throw new ActividadError("¡Uy! Salté mucho... ¡Me pasé!");
    }



}
