/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts" />}

class ElMonoYLasBananas extends Base {
    fondo;
    cuadricula;
    automata;
    estado;
    banana;
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
      this.cuadricula.agregarActor(this.automata, 0, 0, false);
      this.cuadricula.reubicarActorAlMedio(this.automata);

      if (Math.random()< .5)  {
        this.banana = new BananaAnimada(0, 0);
        this.cuadricula.agregarActor(this.banana,0,1, false);
        this.cuadricula.reubicarActorAlMedio(this.banana)
      }
    }


    agregar(objeto){
        
    }

    personajePrincipal(){
      return this.automata;
    }



  }
