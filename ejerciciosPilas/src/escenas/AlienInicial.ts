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
      this.fondo = new Fondo('fondos.alien-inicial.png',0,0);
      this.cuadricula = new Cuadricula(0,0,1,4,
        {alto: 200,separacionEntreCasillas:15},
      {grilla: 'casillas.alien_inicial.png',
      cantColumnas: 1, ancho:100, alto:100})
      this.automata = new AlienAnimado(0,0);
      this.cuadricula.agregarActor(this.automata,0,0);

      this.boton =  new BotonAnimado(200,0);
      //this.cuadricula.agregarActor(this.boton,0,3);
      this.boton.ancho=51;
      this.boton.alto=68;
      this.automata.ancho=this.automata.ancho*(1.3);
      this.automata.alto=this.automata.alto*(1.3);

    }

    personajePrincipal(){
      return this.automata;
    }

    avanzar(){
      this.automata.hacer_luego(MoverACasillaDerecha);
    }

    apretar(){
      this.automata.hacer_luego(DesencadenarAnimacionDobleSiColiciona,{'idAnimacion':'prendida','idAnimacionReceptor':'apretar','etiqueta':'BotonAnimado','mensajeError': 'No hay un botón aquí'})
    }

  }
