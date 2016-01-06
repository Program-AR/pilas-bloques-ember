/// <reference path = "EscenaActividad.ts" />
/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/cuadriculaEsparsa.ts"/>
/// <reference path="../actores/GloboAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}

  class ElCangrejoAguafiestas extends EscenaActividad {
    fondo;
    cuadricula;
    automata;
    cantidadFilas;
    cantidadColumnas;
    globos;
    estado;
    iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo('fondos.nubes.png',0,0);
        this.globos=[];
        this.cantidadFilas=5;
        this.cantidadColumnas=6;
        var matriz= [
          ['T','T','T','T','T','T'],
          ['T','F','F','F','F','T'],
          ['T','T','T','T','T','T'],
          ['T','F','F','F','F','T'],
          ['T','T','T','T','T','T']]
        this.cuadricula = new CuadriculaEsparsa(0,0,{alto: 100},{grilla:'casillas.violeta.png'},matriz)
        this.completarConGlobos();
        this.automata = new CangrejoAnimado(0,0);
        this.cuadricula.agregarActor(this.automata,0,0);
      }

    private completarConGlobos(){
      for(var i = 1; i< this.cantidadColumnas; ++i ){
        var nuevo = new GloboAnimado(0,0);
        this.globos.push(nuevo);
        this.cuadricula.agregarActor(nuevo,0,i);
      }

      for(var i = 0; i< this.cantidadColumnas; ++i ){
        var nuevo = new GloboAnimado(0,0);
        this.globos.push(nuevo);
        this.cuadricula.agregarActor(nuevo,2,i);
        nuevo = new GloboAnimado(0,0);
        this.globos.push(nuevo);
        this.cuadricula.agregarActor(nuevo,4,i);
      }


      nuevo = new GloboAnimado(0,0);
      this.globos.push(nuevo);
      this.cuadricula.agregarActor(nuevo,1,0);

      nuevo = new GloboAnimado(0,0);
      this.globos.push(nuevo);
      this.cuadricula.agregarActor(nuevo,3,0);

      nuevo = new GloboAnimado(0,0);
      this.globos.push(nuevo);
      this.cuadricula.agregarActor(nuevo,1,this.cantidadColumnas-1);

      nuevo = new GloboAnimado(0,0);
      this.globos.push(nuevo);
      this.cuadricula.agregarActor(nuevo,3,this.cantidadColumnas-1);


    }

    moverDerecha(){
      this.automata.hacer_luego(MoverACasillaDerecha);
    }
    moverIzquierda(){
      this.automata.hacer_luego(MoverACasillaIzquierda);
    }
    moverArriba(){
      this.automata.hacer_luego(MoverACasillaArriba);
    }
    moverAbajo(){
      this.automata.hacer_luego(MoverACasillaAbajo);
    }

    explotarGlobo(){

      this.automata.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'GloboAnimado',  'mensajeError' : 'No hay un globo aqui' });

    }



}
