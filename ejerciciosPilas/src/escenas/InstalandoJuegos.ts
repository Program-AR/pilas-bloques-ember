class InstalandoJuegos  extends Base{
  compus;
  instalador;
  fondo;
  cuadricula;
  estado;

  iniciar() {

      this.fondo = new Fondo('fondos.biblioteca.png',0,0);

      var cantidadFilas=1
      var cantidadColumnas=4
      this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,
          {alto: 100},
          {grilla: 'invisible.png',
          cantColumnas: 5})

      this.instalador = new InstaladorAnimado(0,0);
      this.cuadricula.agregarActor(this.instalador,0,0);

      for(var i=1;i<=3;++i){
        this.cuadricula.agregarActor(new CompuAnimada(0,0),0,i);
        }

    var builder= new BuilderStatePattern('inicial');

    builder.agregarEstadosPrefijados('prendido',1,3);
    builder.agregarEstadosPrefijados('escritoA',1,3);
    builder.agregarEstadosPrefijados('escritoB',1,3);
    builder.agregarEstadosPrefijados('escritoC',1,3);
    builder.agregarEstadosPrefijados('juegoInstalado',1,3);
    builder.agregarEstadosPrefijados('maquinaApagada',1,3);
    builder.agregarTransicionesIteradas('maquinaApagada','prendido','prender',1,3,1,3)
    builder.agregarTransicionesIteradas('prendido','escritoA','escribirA',1,3,1,3)
    builder.agregarTransicionesIteradas('escritoA','escritoB','escribirB',1,3,1,3)
    builder.agregarTransicionesIteradas('escritoB','escritoC','escribirC',1,3,1,3)
    builder.agregarTransicionesIteradas('escritoC','juegoInstalado','instalar',1,3,1,3)
    builder.agregarTransicionesIteradas('juegoInstalado','maquinaApagada','apagar',1,3,1,3)
    builder.agregarTransicion('inicial','prendido1','prender');
    builder.agregarTransicion('maquinaApagada1','prendido2','prender');
    builder.agregarTransicion('maquinaApagada2','prendido3','prender');

    //builder.agregarError('inicial','prender','Para prender una compu, hay que estar frente a ella')
    //No es necesario modelarlo, porque se encarga el comportamiento colision
    builder.agregarError('inicial','instalar','Primero hay que prender la computadora')
    builder.agregarError('inicial','escribirA','Primero hay que prender la computadora')
    builder.agregarError('inicial','escribirB','Primero hay que prender la computadora')
    builder.agregarError('inicial','escribirC','Primero hay que prender la computadora')

    builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada','instalar','Primero hay que prender la computadora',1,3)
    builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada','escribirC','Primero hay que prender la computadora',1,3)
    builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada','escribirA','Primero hay que prender la computadora',1,3)
    builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada','escribirB','Primero hay que prender la computadora',1,3)

    builder.agregarErrorAVariosEstadosDeSalida('prendido','escribirC','Esa no es la clave correcta',1,3)
    builder.agregarErrorAVariosEstadosDeSalida('prendido','escribirB','Esa no es la clave correcta',1,3)

    builder.agregarErrorAVariosEstadosDeSalida('escritoA','escribirC','Esa no es la clave correcta',1,3)
    builder.agregarErrorAVariosEstadosDeSalida('escritoA','escribirA','Esa no es la clave correcta',1,3)
    builder.agregarErrorAVariosEstadosDeSalida('escritoB','escribirB','Esa no es la clave correcta',1,3)
    builder.agregarErrorAVariosEstadosDeSalida('escritoB','escribirA','Esa no es la clave correcta',1,3)

    this.estado=builder.estadoInicial();

   }

  personajePrincipal(){
    return this.instalador;
  }

  siguienteCompu(){
    this.instalador.hacer_luego(MoverACasillaDerecha)
  }
  prenderCompu(){
    this.instalador.hacer_luego(PrenderPorEtiqueta,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'prender' });
  }
  apagarCompu(){
    this.instalador.hacer_luego(ApagarPorEtiqueta,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'apagar' });
  }
  instalarJuego(){
    this.instalador.hacer_luego(InstalarPorEtiqueta,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'instalar'})
  }

  escribirC(){
    this.instalador.hacer_luego(EscribirEnCompuAnimada,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'escribirC'})
  }
  escribirB(){
    this.instalador.hacer_luego(EscribirEnCompuAnimada,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'escribirB'})
  }
  escribirA(){
    this.instalador.hacer_luego(EscribirEnCompuAnimada,{'etiqueta' : 'CompuAnimada',  'mensajeError' : 'No hay una compu aqui', 'idComportamiento' : 'escribirA'})
    }



  }







class ApagarPorEtiqueta extends ComportamientoColision {

    metodo(objetoColision){

        objetoColision.cargarAnimacion("apagada");

    }
}


class InstalarPorEtiqueta extends ComportamientoColision {

    metodo(objetoColision){

        objetoColision.cargarAnimacion("instalado");

    }
}

class PrenderPorEtiqueta extends ComportamientoColision {

    metodo(objetoColision){

        objetoColision.cargarAnimacion("prendida");

    }
}

class EscribirEnCompuAnimada extends ComportamientoColision {

    metodo(objetoColision){
      if (this.argumentos['idComportamiento']=='escribirC'){
        objetoColision.cargarAnimacion("claveok");
      }
    }
}
