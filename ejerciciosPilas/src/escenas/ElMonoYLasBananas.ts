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
    iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondos.selva.png',0,0);
        var cantidadFilas=1
        var cantidadColumnas=2
        this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,
            {alto: 100},
            {grilla: 'casillas.violeta.png',
            cantColumnas: 5})

        this.automata =  new  MonoAnimado(0,0);


        this.cuadricula.agregarActor(this.automata,0,0);


    if (Math.random()< .5)  {


            this.agregar(BananaAnimada);
      }
    }


      agregar(objeto){
        this.cuadricula.agregarActor(new objeto(0,0),0,1);
    }

    personajePrincipal(){
      return this.automata;
    }



  }
