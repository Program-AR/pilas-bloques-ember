class FutbolRobots  extends Base{
  robot;
  fondo;
  cuadricula;
  estado;
  definidor;

  iniciar() {
      this.estado=undefined;
      this.fondo = new Fondo('fondos.nubes.png',0,0);
      var cantidadFilas=8;
      this.definidor = new DefinidorColumnasRandom(cantidadFilas,10)
      this.cuadricula = new CuadriculaMultiple(this.definidor)
      this.robot= new RobotAnimado(0,0)
      this.cuadricula.posicionarObjeto(this.robot,0,0);
      for (var fila=0;fila<cantidadFilas;++fila){
        this.cuadricula.posicionarObjeto(new PelotaAnimada(0,0),fila,this.cuadricula.filas[fila].cantidadColumnas-1)
      }
   }
   atras() {
    this.robot.hacer_luego(MoverACasillaIzquierda);
  }

  avanzar(){
    this.robot.hacer_luego(MoverACasillaDerecha);
  }

  siguienteFila(){
    this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
  }

  patearPelota(){
    this.robot.hacer_luego(PatearPelota,{})
  }


}
