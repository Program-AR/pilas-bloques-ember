/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />}

class ElMonoYLasBananas extends EscenaActividad {
    fondo;
    cuadricula;
    automata;
    estado;
    iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondos.selva.png',0,0);
      var cantidadFilas=1
      var cantidadColumnas=2
      this.cuadricula = new Cuadricula(0,-100,cantidadFilas,cantidadColumnas,
          {alto: 200},
          {grilla: 'casillas.violeta.png',
          cantColumnas: 1})

      this.automata =  new  MonoAnimado(0,0);
      this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);

      if (Math.random()< .5)  {
        this.cuadricula.agregarActorEnPerspectiva(new BananaAnimada(0, 0),0,1, false);
      }
    }


    agregar(objeto){

    }

    personajePrincipal(){
      return this.automata;
    }



  }
