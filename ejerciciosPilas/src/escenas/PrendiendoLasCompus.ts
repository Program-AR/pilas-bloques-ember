/// <reference path = "EscenaActividad.ts" />

class PrendiendoLasCompus extends EscenaActividad {
    cuadricula;
    buzo;
    cantidadMaxColumnas;
    cantidadMaxFilas;
    cantidadMinColumnas;
    cantidadMinFilas;
    cantidadFilas;
    cantidadColumnas;
    estado;
    iniciar() {
        this.estado=undefined;
        this.cantidadMaxColumnas=12;
        this.cantidadMinColumnas=5;
        this.cantidadMaxFilas=7;
        this.cantidadMinFilas=4;

        this.cantidadFilas=Math.floor( Math.random() * this.cantidadMaxFilas+this.cantidadMinFilas );
        this.cantidadColumnas=Math.floor( Math.random() * this.cantidadMaxColumnas+this.cantidadMinColumnas );
        this.cuadricula = new Cuadricula(0,0,this.cantidadFilas,this.cantidadColumnas,
            {alto: 300,ancho:300},
            {grilla: 'casillaLightbot.png',
            cantColumnas: 5})
        this.buzo = new Robot(0, 0);
        this.cuadricula.agregarActor(this.buzo,0, 0);
        this.completarConCompusEnLaterales();

    }

    private completarConCompusEnLaterales(){
        //Completo la primer y ultima fila
        for(var i=1;i<this.cantidadColumnas-1;++i){
          this.cuadricula.agregarActor(new CompuAnimada(0,0),0,i);
          this.cuadricula.agregarActor(new CompuAnimada(0,0),this.cantidadFilas-1,i);
        }
        //Completo la primer y ultima columna
        for(var i=1;i<this.cantidadFilas-1;++i){
          this.cuadricula.agregarActor(new CompuAnimada(0,0),i,0);
          this.cuadricula.agregarActor(new CompuAnimada(0,0),i,this.cantidadColumnas-1);
        }

    }
    personajePrincipal(){
      return this.buzo;
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

    prenderCompu(){
          this.buzo.hacer_luego(EncenderPorEtiqueta,{'etiqueta':'CompuAnimada','mensajeError': 'Acá no hay una compu para prender'});

    }


}
