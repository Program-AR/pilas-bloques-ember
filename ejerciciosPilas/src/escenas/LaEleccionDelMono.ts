/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts" />}

class LaEleccionDelMono extends Base {
    fondo;
    cuadricula;
    automata;
    estado;
    iniciar() {
      this.estado=undefined;
    	this.fondo = new Fondo('fondos.selva.png',0,0);
        this.cuadricula = new Cuadricula(0,0,1,2,
            {alto: 200},
            {grilla: 'casillas.violeta.png',
            cantColumnas: 1})

		if (Math.random()< .5)  {
            this.agregar(ManzanaAnimada);
        }else{
            this.agregar(BananaAnimada);
        }

        this.automata =  new  MonoAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0,false);

    }

    agregar(objeto){
      this.cuadricula.agregarActorEnPerspectiva(new objeto(0,0),0,1, false);
    }

    personajePrincipal(){
      return this.automata;
    }



  }
