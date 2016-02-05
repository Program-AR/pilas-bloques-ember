/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Lamparin.ts" />
/// <reference path = "../actores/CuadriculaMultiple.ts" />
/// <reference path = "../comportamientos/ComportamientoColision.ts" />



class TitoCuadrado extends EscenaActividad {
    fondo;
    personaje;
    cuadricula;
    cantidadFilas;
    cantidadColumnas;
    objetos;
iniciar() {
    this.fondo = new Fondo('fondos.nubes.png',0,0);
    this.cantidadFilas=7;
    this.cantidadColumnas=7;
    var matriz= [
      ['T','T','T','T','T','T','T'],
      ['T','F','F','F','F','F','T'],
      ['T','F','F','F','F','F','T'],
      ['T','F','F','F','F','F','T'],
      ['T','F','F','F','F','F','T'],
      ['T','F','F','F','F','F','T'],
      ['T','T','T','T','T','T','T']
      ]
    this.cuadricula = new CuadriculaEsparsa(0,0,{alto: 100},{grilla:'casillas.violeta.png'},matriz)
    this.personaje = new Tito(0,0);
    this.cuadricula.agregarActor(this.personaje,0,0);

    this.agregarLuces();
  }


  private agregarLuces(){
    for(var i=1;i<this.cantidadColumnas-1;i++){
      if (Math.random() < .5) {
        this.agregarLuz(0,i);
        //filaSuperior
    }
    if (Math.random() < .5) {
      this.agregarLuz(this.cantidadFilas-1,i);
    }
    //filaInferior
  }

  for(var j=1;j<this.cantidadFilas-1;j++){
    if (Math.random() < .5) {
      this.agregarLuz(j,0);
    }
    if (Math.random() < .5) {
      this.agregarLuz(j,this.cantidadColumnas-1);
    }
  }


}

  private agregarLuz(f,c) {

    this.cuadricula.agregarActor(new Lamparin(0,0),f,c);
    //this.objetos.push(casillaLuminosa);
  }



  moverArriba(){
      this.personaje.hacer_luego(MoverACasillaArriba);
  }

  moverAbajo(){
      this.personaje.hacer_luego(MoverACasillaAbajo);
  }

  moverDerecha(){
      this.personaje.hacer_luego(MoverACasillaDerecha);
  }

  moverIzquierda(){
      this.personaje.hacer_luego(MoverACasillaIzquierda);
  }

  prenderLuz() {
      this.personaje.hacer_luego(EncenderPorEtiqueta, {etiqueta:'Luz'});
  }




}
