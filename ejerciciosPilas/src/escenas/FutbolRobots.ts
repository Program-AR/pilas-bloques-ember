class FutbolRobots  extends Base{
  automata;
  fondo;
  cuadricula;
  estado;
  definidor;

  iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondos.futbolRobots.png',0,0);
      var cantidadFilas=8;
      this.definidor = new DefinidorColumnasRandom(cantidadFilas,6)
      //this.cuadricula = new CuadriculaMultiple(this.definidor,50.0);
      this.cuadricula = new CuadriculaMultiple(this.definidor,0,-10,{separacionEntreCasillas: 5},{grilla:'casillaLightbot.png', cantColumnas: 5,alto:45,ancho:45})
      this.cuadricula.cambiarImagenCasillas('casilla.futbolRobots2.png');
      this.cuadricula.cambiarImagenInicio('casilla.futbolRobots1.png');
      this.automata= new RobotAnimado(0,0)
      this.cuadricula.agregarActorEnPerspectiva(this.automata,0,0,true);
      for (var fila=0;fila<cantidadFilas;++fila){
        this.cuadricula.agregarActor(new PelotaAnimada(0,0),fila,this.cuadricula.dameIndexUltimaPosicion(fila))
      }

   }
   atras() {
    this.automata.hacer_luego(MoverACasillaIzquierda);
  }

  avanzar(){
    this.automata.hacer_luego(MoverACasillaDerecha);
  }

  siguienteFila(){
    this.automata.hacer_luego(avanzarFilaEnCuadriculaMultiple);
  }

  patearPelota(){
    this.automata.hacer_luego(RecogerPorEtiqueta,{'etiqueta':'PelotaAnimada','mensajeError' : 'No hay una pelota aquí'})
  }
  patearPelota2(){
      this.automata.hacer_luego(DesencadenarAnimacionDobleSiColiciona,{'idAnimacion':'patear','idAnimacionReceptor':'patear','etiqueta':'PelotaAnimada','mensajeError': 'No hay un botón aquí'})
  }



}
