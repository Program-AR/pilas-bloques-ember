/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/cuadriculaEsparsa.ts"/>
/// <reference path="../actores/RatonAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path="Camino.ts"/>

class LaberintoConQueso extends Base {
    estado;
    personaje;    cuadricula;    queso; secuenciaCaminata; condicion;
    iniciar() {
        this.estado=undefined;
        this.cuadricula = new CuadriculaParaRaton(0,0,10,10,{alto: 100},{'ancho':50,'alto':50,'->':'casillaDerecha.png','<-':'casillaIzquierda.png','v':'casillaAbajo.png','^':'casillaArriba.png'}).dameCamino();

        this.cuadricula.completarConObjetosRandom(new conjuntoClases([QuesoAnimado]));
        var a= new RatonAnimado(0,0);
        this.personaje=new RatonAnimado(0,0)

        this.cuadricula.agregarActor(this.personaje,0,0);
        this.secuenciaCaminata = new Secuencia({'secuencia':[CaminaArriba]})
        this.secuenciaCaminata.iniciar(this.personaje);
        this.condicion = function(){return this.receptor.y > 250;  }



      }

    valorCondicion(argumentos){
      return argumentos.receptor.y > 250;
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

    Irse(){
      this.personaje.hacer_luego();
    }

    Irse2(){
      this.personaje.hacer_luego(RepetirHasta,{'secuencia':this.secuenciaCaminata, 'condicion':this.condicion });
    }


}
