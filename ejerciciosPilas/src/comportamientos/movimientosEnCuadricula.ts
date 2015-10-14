/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>

class MovimientoEnCuadricula extends MovimientoAnimado {
    cuadricula;
    vectorDireccion;
    estoyEmpezandoAMoverme;

    alIniciar(){
        this.cuadricula = this.receptor.cuadricula;
        this.argumentos.direccion = new Direct(this.vectorDireccion.x,this.vectorDireccion.y);
        this.argumentos.distancia = this.distancia();
        super.alIniciar();
        this.estoyEmpezandoAMoverme = true;
    }

    doActualizar(){
        if (!this.puedoMovermeEnEsaDireccion() || super.doActualizar()){
            return true;
        }
    }

    puedoMovermeEnEsaDireccion(){
        if (this.estoyEmpezandoAMoverme){
            this.estoyEmpezandoAMoverme = false;
            return this.verificarDireccion(this.receptor.casillaActual());
        }
        return true;
    }

    distancia(){
        // Template Method. Devuelve la distancia vertical ú horizontal según corresponda
    }

    distanciaHorizontal(){
        return this.cuadricula.anchoCasilla() + this.cuadricula.separacion();
    }
    distanciaVertical(){
        return this.cuadricula.altoCasilla() + this.cuadricula.separacion();
    }
    verificarDireccion(casilla){
        var proximaCasilla = this.proximaCasilla(casilla);
        if (!proximaCasilla){
            this.receptor.decir("No puedo ir para " + this.textoAMostrar());
            return false;
        };
        this.receptor.setCasillaActual(proximaCasilla);
        return true
    }

    proximaCasilla(casilla){
        // Template Method. Devolver la casilla a la que se va a avanzar
    }

    textoAMostrar(){
        // Template Method. Para mostrar mensaje descriptivo al no poder avanzar
    }
}

class MoverACasillaDerecha extends MovimientoEnCuadricula {
    vectorDireccion = { x: 1, y: 0 };

    proximaCasilla(casilla){
        return casilla.casillaASuDerecha();
    }
    textoAMostrar(){
        return "la derecha";
    }
    distancia(){
        return this.distanciaHorizontal();
    }
}

class MoverACasillaArriba extends MovimientoEnCuadricula{
    vectorDireccion = { x: 0, y: 1 };

    proximaCasilla(casilla){
        return casilla.casillaDeArriba();
    }
    textoAMostrar(){
        return "arriba";
    }
    distancia(){
        return this.distanciaVertical();
    }
}

class MoverACasillaAbajo extends MovimientoEnCuadricula{
    vectorDireccion = { x: 0, y: -1 };

    proximaCasilla(casilla){
        return casilla.casillaDeAbajo();
    }
    textoAMostrar(){
        return "abajo";
    }
    distancia(){
        return this.distanciaVertical();
    }
}

class MoverACasillaIzquierda extends MovimientoEnCuadricula{
    vectorDireccion = { x: -1, y: 0 };

    proximaCasilla(casilla){
        return casilla.casillaASuIzquierda();
    }
    textoAMostrar(){
        return "la izquierda";
    }
    distancia(){
        return this.distanciaHorizontal();
    }
}

class MoverTodoAIzquierda extends MoverACasillaIzquierda{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroFila,0);
   }
   distancia(){
        return this.distanciaHorizontal()
               * this.receptor.casillaActual().nroColumna;
   }
}

class MoverTodoADerecha extends MoverACasillaDerecha{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroFila,this.cuadricula.cantColumnas-1);
   }
   distancia(){
        return this.distanciaHorizontal()
               * (this.cuadricula.cantColumnas - 1 - this.receptor.casillaActual().nroColumna );
   }
}

class MoverTodoArriba extends MoverACasillaArriba{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroColumna,0);
   }
   distancia(){
        return this.distanciaVertical()
               * this.receptor.casillaActual().nroFila;
   }
}

class MoverTodoAbajo extends MoverACasillaAbajo{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroColumna,this.cuadricula.cantFilas-1);
   }
   distancia(){
        return this.distanciaVertical()
               * (this.cuadricula.cantFilas - 1 - this.receptor.casillaActual().nroColumna);
   }
}
