/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts" />}

class AlienInicial extends Base {
    fondo;
    cuadricula;
    automata;
    estado;
    boton;
    iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondos.selva.png',0,0);
      this.cuadricula = new Cuadricula(0,0,1,4,
        {alto: 200},
      {grilla: 'casillas.violeta.png',
      cantColumnas: 1})
      this.automata = new AlienAnimado(0,0);
      this.cuadricula.agregarActor(this.automata,0,0);
      this.boton =  new BotonAnimado(0,0);
      this.cuadricula.agregarActor(this.boton,0,3);

    }

    personajePrincipal(){
      return this.automata;
    }



  }
