class FutbolRobots  extends Base{
  automata;
  fondo;
  cuadricula;
  estado;
  definidor;

  iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondos.selva.png',0,0);


      var cantidadFilas=8;
      this.definidor = new DefinidorColumnasRandom(cantidadFilas,10)
      this.cuadricula = new CuadriculaMultiple(this.definidor)
      this.cuadricula.cambiarImagenCasillas('casilla.futbolRobots2.png');
      this.cuadricula.cambiarImagenInicio('casilla.futbolRobots1.png');
      this.automata= new RobotAnimado(0,0)

      this.cuadricula.posicionarObjeto(this.automata,0,0);
      for (var fila=0;fila<cantidadFilas;++fila){
        this.cuadricula.posicionarObjeto(new PelotaAnimada(0,0),fila,this.cuadricula.filas[fila].cantidadColumnas-1)
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


}
