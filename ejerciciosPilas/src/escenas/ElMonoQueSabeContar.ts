/// <reference path="../actores/CuadriculaMultiple.ts"/>

class ElMonoQueSabeContar extends Base {
    fondo;
    cuadricula;
    automata;
    cantMaxColumnas;
    etiquetasDeObjetosAColocar= new ConjuntoClases([ManzanaAnimada,BananaAnimada])
    definidor;
    texto;
    contador;
    contadorDeEtiquetas;
    tableroBananas;
    tableroManzanas;
    cantidadManzanas;
    cantidadBananas;
    estado;
    puntaje;
    iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo('fondos.selva.png',0,0);
        this.definidor = new DefinidorColumnasRandom(5,7)
        this.cuadricula = new CuadriculaMultipleColumnas(this.definidor,0,0,{separacionEntreCasillas: 5},{alto:40,ancho:40, grilla: 'casillas.violeta.png', cantColumnas: 1 })

        this.cuadricula.completarConObjetosRandom(this.etiquetasDeObjetosAColocar,
          {condiciones:[
            function(fila,col,pmatrix){return fila!=0;},
            //no incluye en primera fila
            function(fila,col,pmatrix){return pmatrix[fila+1]!=undefined && pmatrix[fila+1][col]=='T';}
            //no incluye en ultima fila
          ]}
          );
        this.cuadricula.cambiarImagenInicio('casilla.titoFinalizacion.png')
        this.cuadricula.cambiarImagenFin('casillas.alien_inicial.png')
        this.automata = new MonoAnimado(0,0);
        this.automata.escala=0.5
        this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0,false);
        this.tableroManzanas = new Tablero(120,210,{texto:"Manzanas",separacionX:50,valorInicial:0,imagen:'casilla.titoFinalizacion.png'});
        this.tableroBananas = new Tablero(-120,230,{texto:"Bananas",separacionX:50,valorInicial:0,imagen:'casilla.titoFinalizacion.png'});
        this.cantidadManzanas= new ObservadoConAumentar(0);
        this.cantidadBananas= new ObservadoConAumentar(0);
        this.cantidadManzanas.registrarObservador(this.tableroManzanas,0);
        this.cantidadBananas.registrarObservador(this.tableroBananas,0);

        this.cuadricula.arriba=200;

    }

    personajePrincipal(){
      return this.automata;
    }

  contar(){
    this.automata.hacer_luego(ContarPorEtiqueta,{etiqueta:BananaAnimada,dondeReflejarValor:this.cantidadManzanas,mensajeError:'a'})
  }

}
