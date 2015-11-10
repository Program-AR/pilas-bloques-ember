/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />}

class ElGatoEnLaCalle extends Base {
    fondo;
    automata;

    boton;
    fondoCuadricula;
    saltosFaltantes;

    iniciar() {

      this.fondo = new Fondo('fondo.gatoEnLaCalle.png',0,0);
      this.automata = new GatoAnimado(0,-150);
    }

    personajePrincipal(){
      return this.automata;
    }


    saludar(){
      this.automata.hacer_luego(ComportamientoAnimado,{nombreAnimacion: 'saludando'});
    }

    ao(){
      this.automata.hacer_luego(ComportamientoAnimado,{nombreAnimacion: 'abrirOjos'});
    }

    co(){
      this.automata.hacer_luego(ComportamientoAnimado,{nombreAnimacion: 'cerrarOjos'});
    }
    avanzar(){
      this.automata.hacer_luego(ComportamientoAnimado,{nombreAnimacion: 'correr'});
    }

    volver(){
    this.automata.hacer_luego(ComportamientoAnimado,{nombreAnimacion: 'volver'});
    }


}
