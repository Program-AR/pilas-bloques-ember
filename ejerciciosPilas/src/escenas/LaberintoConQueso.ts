/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/cuadriculaEsparsa.ts"/>
/// <reference path="../actores/RatonAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path="Camino.ts"/>

class LaberintoConQueso extends Base {
    estado;
    personaje;    cuadricula;    queso;
    iniciar() {
        this.estado=undefined;
        this.personaje = new RatonAnimado(0,0);
        this.cuadricula = new CuadriculaParaRaton(0,0,10,10,{alto: 100},{'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}).dameCamino();
        this.cuadricula.agregarActor(this.personaje,0,0);
        this.cuadricula.completarConObjetosRandom(new conjuntoClases([QuesoAnimado]));
      }

    personajePrincipal(){
      return this.personaje;
    }

    moverDerecha(){
      this.personaje.hacer_luego(MoverACasillaDerechaEsparsa);
    }

    moverAbajo(){
      this.personaje.hacer_luego(MoverACasillaAbajoEsparsa);
    }

    ComerQueso(){

      this.personaje.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'QuesoAnimado',  'mensajeError' : 'No hay queso aqui' });

    }



}
