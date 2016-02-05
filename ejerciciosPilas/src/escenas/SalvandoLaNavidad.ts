/*class SalvandoLaNavidad extends EscenaActividad {
  personaje;
  cantidadColumnas;
  cuadricula;
  condicion;
  secuenciaCaminata;


  fondo;
  definidor;
  columnas;
iniciar() {
        this.fondo = new Fondo('fondos.nubes.png',0,0);
        this.columnas=[5,6,8,4,7]
        this.definidor = new DefinidorColumnasFijo(5,this.columnas);
        this.cuadricula = new CuadriculaMultiple(this.definidor,{alto: 40, ancho:40*5})
        this.personaje = new PapaNoelAnimado(0,0);
        this.cuadricula.posicionarObjeto(this.personaje,0,0);
        this.completarConRegalos();



    }

  private completarConRegalos(){
    for(var i =0;i<5;i++){
    this.cuadricula.posicionarObjeto(new RegaloAnimado(0,0),i,this.columnas[i]-1);
    }

  }


  personajePrincipal(){
    return this.personaje;
  }


  avanzar(){
    this.personaje.hacer_luego(MoverACasillaDerecha);
  }
  siguienteFila(){

    this.personaje.hacer_luego(avanzarFilaEnCuadriculaMultipleDesdeCualquierLado,{'cuadriculaMultiple':this.cuadricula});
  }

  tomarRegalo(){
    this.personaje.hacer_luego(RecogerPorEtiqueta,{'etiqueta':'RegaloAnimado','mensajeError':'No hay un regalo aquí'});
  }

}
*/
