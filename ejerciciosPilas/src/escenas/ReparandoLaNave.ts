/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/MarcianoVerdeAnimado.ts" />
/// <reference path = "../actores/NaveAnimada.ts" />
/// <reference path = "../actores/CarbonAnimado.ts" />
/// <reference path = "../actores/HierroAnimado.ts" />
/// <reference path = "../actores/Tablero.ts" />
/// <reference path = "../actores/ObservadoAnimado.ts" />
/// <reference path = "../actores/ActorCompuesto.ts" />
/// <reference path = "EstadosDeEscena.ts" />
/// <reference path = "../comportamientos/ComportamientoColision.ts" />
/// <reference path = "../habilidades/Flotar.ts" />
/// <reference path = "../comportamientos/MovimientoAnimado.ts" />


class ReparandoLaNave extends EscenaActividad {
  compus;
  fondo;
  cuadricula;
  carbon;
  hierro;
  nave;

  iniciar() {
    this.fondo = new Fondo('fondos.reparandoLaNave.png',0,0);
    var cantidadFilas=4
    var cantidadColumnas=5

    this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,
        {ancho:323,alto:261},
        {grilla: 'invisible.png',
        cantColumnas: 1});

    this.crearActores(cantidadFilas, cantidadColumnas);
    this.crearTableros();
    this.crearEstado();
  }

  private crearActores(cFilas, cColumnas){
    this.crearAutomata(cFilas, cColumnas);

    this.nave = new NaveAnimada(0, 0);
    this.cuadricula.agregarActor(this.nave, cFilas - 1, 0);

    this.hierro = new HierroAnimado(0, 0);
    this.hierro.cantidad = 3;
    this.carbon = new CarbonAnimado(0, 0);
    this.carbon.cantidad = 3;
    this.cuadricula.agregarActor(this.hierro, 0, 0);
    this.hierro.aprender(Flotar, { Desvio: 2 });
    this.cuadricula.agregarActor(this.carbon, 0, cColumnas - 1);
    this.carbon.aprender(Flotar, { Desvio: 2 });
  }

  private crearAutomata(cantidadFilas, cantidadColumnas) {
    this.automata = new ActorCompuesto(0, 0, { subactores: [new MarcianoVerdeAnimado(0, 0)]});
    this.cuadricula.agregarActorEnPerspectiva(this.automata, cantidadFilas - 1, 0, false);
    this.automata.escala = 0.75;
    this.automata.y += 50;
  }

  private crearTableros() {
    Trait.toObject(ObservadoConDisminuir, this.carbon);
    Trait.toObject(ObservadoConDisminuir, this.hierro);

    this.hierro.registrarObservador(
      new Tablero(150, 220, { texto: "Hierro" }));
    this.carbon.registrarObservador(
      new Tablero(150, 190, { texto: "Carbon" }));

    this.carbon.changed();
    this.hierro.changed();
  }

  private crearEstado() {
    var builder = new BuilderStatePattern('estoy00');
    this.definirTransiciones(builder);
    this.estado = builder.estadoInicial();
  }

  private definirTransiciones(builder){
    //modelo estoyCH como cantidad de carbon y de hierro ya depositados,
    //CestoyCH como tengo carbon en mano
    // y HestoyCH como tengo hierro en mano.
    //Estados donde no tengo nada en la mano.
    for(var hierro=0;hierro<=3;hierro++){
        for(var carbon=0;carbon<=3;carbon++){
            builder.agregarEstado(('estoy'+hierro)+carbon)
            builder.agregarEstado((('estoy'+hierro)+carbon)+'carbon')
            builder.agregarEstado((('estoy'+hierro)+carbon)+'hierro')
        }
    }
    //no unificar los fors, necesito tener creados los estados antes de las transi
    for(var hierro=0;hierro<=3;hierro++){
        for(var carbon=0;carbon<=3;carbon++){
          builder.agregarError('estoy'+hierro+carbon,'depositar','No tengo nada en la mano')
        if(hierro!=3){
            builder.agregarTransicion((('estoy'+hierro)+carbon)+'hierro',('estoy'+(hierro+1))+carbon,'depositar')
            builder.agregarTransicion((('estoy'+hierro)+carbon),'estoy'+(hierro)+carbon+'hierro','tomarHierro')

        }
        if(carbon!=3){
            builder.agregarTransicion((('estoy'+hierro)+carbon)+'carbon',('estoy'+hierro)+(carbon+1),'depositar')
            builder.agregarTransicion((('estoy'+hierro)+carbon),'estoy'+(hierro)+carbon+'carbon','tomarCarbon')
        }
      }
    }
  }
}

class Depositar extends ComportamientoColision{
  metodo(objetoColision){
      pilas.escena_actual().automata.eliminarUltimoSubactor();
  }
}
