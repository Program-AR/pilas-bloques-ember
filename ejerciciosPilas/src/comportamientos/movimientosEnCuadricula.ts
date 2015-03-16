/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class MovimientoEnCuadricula extends Comportamiento {
    cuadricula;
    movimiento;
    estoyEmpezandoAMoverme;
    claseQueImita;
    
    iniciar(receptor){
        super.iniciar(receptor);
        this.cuadricula = receptor.cuadricula;
        this.movimiento = new this.claseQueImita({});
        this.movimiento.iniciar(receptor);
        this.movimiento.velocidad = this.velocidad();
        this.estoyEmpezandoAMoverme = true;
    }
    actualizar(){
        if (!this.puedoMovermeEnEsaDireccion() || this.movimiento.actualizar()){
            
            return true;
        }
    }
//    claseQueImita(){
//        // Template Method. Las subclases deben devolver una clase de comportamiento.
//    }
    puedoMovermeEnEsaDireccion(){
        if (this.estoyEmpezandoAMoverme){
            this.estoyEmpezandoAMoverme = false;
            return this.verificarDireccion(this.receptor.casillaActual());
        }
        return true;
    }
    
    velocidad(){
        // Template Method. Devuelve la velocidad vertical ú horizontal según corresponda 
    }
    
    // El nro 20 depende del nro 0.05 establecido en CaminaBase
    velocidadHorizontal(){
        return this.cuadricula.anchoCasilla() / 20;    
    }
    velocidadVertical(){
        return this.cuadricula.altoCasilla() / 20;
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
    claseQueImita = CaminaDerecha;
    
    proximaCasilla(casilla){
        return casilla.casillaASuDerecha();
    }
    textoAMostrar(){
        return "la derecha";
    }
    velocidad(){
        return this.velocidadHorizontal();
    }
}

class MoverACasillaArriba extends MovimientoEnCuadricula{
    claseQueImita = CaminaArriba;

    proximaCasilla(casilla){
        return casilla.casillaDeArriba();
    }
    textoAMostrar(){
        return "arriba";
    }
    velocidad(){
        return this.velocidadVertical();
    }
}

class MoverACasillaAbajo extends MovimientoEnCuadricula{
    claseQueImita = CaminaAbajo;

    proximaCasilla(casilla){
        return casilla.casillaDeAbajo();
    }
    textoAMostrar(){
        return "abajo";
    }
    velocidad(){
        return this.velocidadVertical();
    }
}

class MoverACasillaIzquierda extends MovimientoEnCuadricula{
    claseQueImita = CaminaIzquierda;

    proximaCasilla(casilla){
        return casilla.casillaASuIzquierda();
    }
    textoAMostrar(){
        return "la izquierda";
    }
    velocidad(){
        return this.velocidadHorizontal();
    }
}

class MoverTodoAIzquierda extends MoverACasillaIzquierda{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroFila,0);
   }
   velocidad(){
        return this.velocidadHorizontal() * this.receptor.casillaActual().nroColumna;
   }
}

class MoverTodoADerecha extends MoverACasillaDerecha{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroFila,this.cuadricula.cantColumnas-1);
   }
   velocidad(){
        return this.velocidadHorizontal() * (this.cuadricula.cantColumnas - 1 - this.receptor.casillaActual().nroColumna );
   }
}

class MoverTodoArriba extends MoverACasillaArriba{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroColumna,0);
   }
   velocidad(){
        return this.velocidadVertical() * this.receptor.casillaActual().nroFila;
   }
}

class MoverTodoAbajo extends MoverACasillaAbajo{
   proximaCasilla(casilla){
        return this.cuadricula.casilla(this.receptor.casillaActual().nroColumna,this.cuadricula.cantFilas-1);
   }
   velocidad(){
        return this.velocidadVertical() * (this.cuadricula.cantFilas - 1 - this.receptor.casillaActual().nroColumna);
   }
}