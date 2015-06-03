class AlimentandoALosPeces extends Base {
    cuadricula;
    buzo;
    cantidadColumnas;
    cantidadFilas;
    alimento;
    estado;
    iniciar() {
        this.cantidadFilas=4
        this.cantidadColumnas=5
        this.cuadricula = new Cuadricula(0,0,this.cantidadFilas,this.cantidadColumnas,
            {lalto: 300,ancho:300},
            {grilla: 'casillaLightbot.png',
            cantColumnas: 5})
        this.buzo = new BuzoAnimado(0, 0);
        this.cuadricula.agregarActor(this.buzo,this.cantidadFilas-1, 0);
        this.alimento = new AlimentoAnimado(0,0)
        this.cuadricula.agregarActor(this.alimento,1,this.cantidadColumnas-1)
        this.colocarPeces();
        this.estado=this.generarEstadoInicial();
    }

    generarEstadoInicial(){
      var builder= new BuilderStatePattern('inicial');
      builder.agregarEstado('tengoLaComida');
      builder.agregarTransicion('inicial','tengoLaComida','recogerComida')
      builder.agregarTransicion('tengoLaComida','tengoLaComida','alimentarPez')
      builder.agregarError('inicial','alimentarPez','Debés recolectar primero el alimento')
      return builder.estadoInicial();
    }


    personajePrincipal(){
      return this.buzo;
    }

    private colocarPeces(){
      this.cuadricula.agregarActor(new PezAnimado(0,0),this.cantidadFilas-1,1);
      this.cuadricula.agregarActor(new PezAnimado(0,0),this.cantidadFilas-1,2);
      this.cuadricula.agregarActor(new PezAnimado(0,0),this.cantidadFilas-1,3);
      this.cuadricula.agregarActor(new PezAnimado(0,0),0,0);
      this.cuadricula.agregarActor(new PezAnimado(0,0),0,1);
      this.cuadricula.agregarActor(new PezAnimado(0,0),0,2);
      this.cuadricula.agregarActor(new PezAnimado(0,0),0,3);
    }

    alimentarPez(){
      this.buzo.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'PezAnimado', 'mensajeError' : 'No hay un pez aqui', 'idComportamiento' : 'alimentarPez' })
    }
    agarrarComida(){
      this.buzo.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'AlimentoAnimado', 'mensajeError' : 'No hay una alimento aqui', 'idComportamiento' : 'recogerComida' });
    }

    moverDerecha(){
           this.buzo.hacer_luego(MoverACasillaDerecha);
    }
    moverIzquierda(){
           this.buzo.hacer_luego(MoverACasillaIzquierda);
    }
    moverAbajo(){
           this.buzo.hacer_luego(MoverACasillaAbajo);
    }
    moverArriba(){
           this.buzo.hacer_luego(MoverACasillaArriba);
    }



}
