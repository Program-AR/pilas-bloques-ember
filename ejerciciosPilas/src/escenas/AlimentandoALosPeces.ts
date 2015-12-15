/// <reference path = "EscenaActividad.ts" />

class AlimentandoALosPeces extends EscenaActividad {
    cuadricula;
    automata;
    cantidadColumnas;
    cantidadFilas;
    alimento;
    estado;
    fondo;
    iniciar() {
        this.cantidadFilas=4
        this.cantidadColumnas=5
        this.fondo = new Fondo('fondo.alimentando_peces.png.png',0,0);
        this.cuadricula = new Cuadricula(0,0,this.cantidadFilas,this.cantidadColumnas,
            {},
            {grilla: 'invisible.png',
            cantColumnas: 5,alto: 50,ancho:50})
            
        this.automata = new BuzoAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata,this.cantidadFilas-1, 0);
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
      this.automata.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'PezAnimado', 'mensajeError' : 'No hay un pez aqui', 'idComportamiento' : 'alimentarPez' })
    }
    agarrarComida(){
      this.automata.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'AlimentoAnimado', 'mensajeError' : 'No hay una alimento aqui', 'idComportamiento' : 'recogerComida' });
    }

}
