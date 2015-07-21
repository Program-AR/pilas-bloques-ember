class ElPlanetaDeNano extends Base {
  personaje;
  estado;
  cantidadColumnas;
  cuadricula;

  condicion;
  secuenciaCaminata;
  tableroBananas;
  cantidadBananas;
iniciar() {
    this.estado=undefined;
    //this.recolector.izquierda = pilas.izquierda();
    var cantidadFilas=4
    this.cantidadColumnas=5

    this.cuadricula = new Cuadricula(0,0,cantidadFilas,this.cantidadColumnas,
        {alto: 300,ancho:300},
        {grilla: 'casillaLightbot.png',
        cantColumnas: 5})
    this.personaje = new MariaAnimada(0, 0);
    this.cuadricula.agregarActor(this.personaje,cantidadFilas-1, 0);
    this.secuenciaCaminata = new Secuencia({'secuencia':[ new MoverACasillaIzquierda({})]})
    this.secuenciaCaminata.iniciar(this.personaje);
    this.condicion = () => { return this.personajePrincipal().casillaActual().nroColumna==0;}
    this.tableroBananas = new Tablero(150,220,"Bananas");
    this.cantidadBananas= new ObservadoConAumentar(0);
    this.cantidadBananas.registrarObservador(this.tableroBananas,0);
    this.completarConBananas();
}

  personajePrincipal(){
    return this.personaje;
  }


  private completarConBananas(){
      this.cuadricula.agregarActor(new BananaAnimada(0,0),0,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),1,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),1,2);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),2,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),2,2);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),2,3);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,1);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,2);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,3);
      this.cuadricula.agregarActor(new BananaAnimada(0,0),3,4);
    }

  volverABordeIzquierdo(){
    this.personaje.hacer_luego(RepetirHasta,{'secuencia':this.secuenciaCaminata, 'condicion':this.condicion });
  }


  comerBanana(){
    this.personaje.hacer_luego(RecogerPorEtiqueta,{'etiqueta':'BananaAnimada','mensajeError':'No hay una banana aquí','dondeReflejarValor':this.cantidadBananas});
  }

  moverDerecha(){
    this.personaje.hacer_luego(MoverACasillaDerecha);
  }

  moverArriba(){
    this.personaje.hacer_luego(MoverACasillaArriba);

  }
}
