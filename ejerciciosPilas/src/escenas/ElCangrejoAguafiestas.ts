/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/cuadriculaEsparsa.ts"/>
/// <reference path="../actores/GloboAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}

  class ElCangrejoAguafiestas extends Base {
    fondo;
    cuadricula;
    cangrejo;
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
        var matriz= [[true,true,true,true,true,true],[true,false,false,false,false,true],[true,true,true,true,true,true],[true,false,false,false,false,true],[true,true,true,true,true,true]]
        this.cuadricula = new CuadriculaEsparsa(0,0,this.cantidadFilas,this.cantidadColumnas,{alto: 100},{grilla:'casillaLightbot.png', cantColumnas: 5},matriz)
        this.completarConGlobos();
        this.cangrejo = new CangrejoAnimado(0,0);
        this.cuadricula.agregarActor(this.cangrejo,0,0);
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
      this.cangrejo.hacer_luego(MoverACasillaDerechaEsparsa);
    }
    moverIzquierda(){
      this.cangrejo.hacer_luego(MoverACasillaIzquierdaEsparsa);
    }
    moverArriba(){
      this.cangrejo.hacer_luego(MoverACasillaArribaEsparsa);
    }
    moverAbajo(){
      this.cangrejo.hacer_luego(MoverACasillaAbajoEsparsa);
    }

    explotarGlobo(){

      this.cangrejo.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'GloboAnimado',  'mensajeError' : 'No hay un globo aqui' });

    }



}
