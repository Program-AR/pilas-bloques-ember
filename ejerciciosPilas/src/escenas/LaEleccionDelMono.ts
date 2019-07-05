/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />
/// <reference path = "../actores/FlechaEscenarioAleatorio.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />

class LaEleccionDelMono extends EscenaActividad {
    fondo;
    cuadricula;
    iniciar() {
        this.estado = new Estado(() => this.cantidadObjetosConEtiqueta('BananaAnimada')==0 && this.cantidadObjetosConEtiqueta('ManzanaAnimada')==0 && this.automata.casillaActual().sos(0,1));
        this.fondo = new Fondo('fondos.selva.png',0,0);
        this.cuadricula = new Cuadricula(0,0,1,2,
            {alto: 200},
            {grilla: 'casillas.violeta.png',
            cantColumnas: 1})

        this.automata =  new  MonoAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0,false);

        this.agregarFruta();
        new FlechaEscenarioAleatorio();
    }

    agregarFruta(){
        if (Math.random() < .5) {
            this.agregar(ManzanaAnimada);
        } else {
            this.agregar(BananaAnimada);
        }
    }

    agregar(objeto){
      this.cuadricula.agregarActorEnPerspectiva(new objeto(0,0),0,1, false);
    }

  }
