
/// <reference path = "../comportamientos/SaltarHablando.ts" />


/**
 * @class NoMeCansoDeSaltar
 *
 * Objetivos: Introducir Repetición
 * Enunciado: Repetir salto.
 */
 class NoMeCansoDeSaltar extends Base {
   automata
   fondo
   saltosFaltantes;


 	iniciar() {
        this.fondo = new Fondo('fondo.noMeCansoDeSaltar.png',0,0);
        this.automata = new GatoAnimado(0,-150);
        this.saltosFaltantes=30;
        }

  /*  s(){
      this.automata.hacer_luego(SaltarHablando,{});
    }

    fraseAlSaltar(){
      if(this.saltosFaltantes==0){
        return "Ya salte todo lo necesario"
      }else{
        this.saltosFaltantes--;
        return "Faltan " + this.saltosFaltantes + " saltos";

      }
    }*/



}
