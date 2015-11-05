/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />}

class ElGatoEnLaCalle extends Base {
    fondo;
    cuadricula;
    automata;
    estado;
    boton;
    fondoCuadricula;

    iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondo.gatoEnLaCalle.png',0,0);
      this.automata = new GatoAnimado(0,0);
    }

    personajePrincipal(){
      return this.automata;
    }

  }
