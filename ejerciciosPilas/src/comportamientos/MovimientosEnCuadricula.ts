/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>
/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../actores/libroPrimaria/Letra.ts" />


class MovimientoEnCuadricula extends MovimientoAnimado {
    cuadricula;
    estoyEmpezandoAMoverme;
    direccionCasilla; // Strategy

    preAnimacion(){
        this.cuadricula = this.receptor.cuadricula;

        if (!this.direccionCasilla) {
          let clase:any = window[this.argumentos.claseDirCasilla];
          this.direccionCasilla = new clase();
        }

        this.argumentos.direccion = new Direct(this.vectorDireccion().x,this.vectorDireccion().y);
        this.argumentos.distancia = this.distancia();
        super.preAnimacion();
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
        return this.direccionCasilla.distancia(this);
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
            throw new ActividadError("No puedo ir para " + this.textoAMostrar());
            return false;
        };
        if (proximaCasilla.tieneActorConEtiqueta('Obstaculo')){
            throw new ActividadError("Hay un obstáculo para " + this.textoAMostrar());
            return false;
        };
        this.receptor.setCasillaActual(proximaCasilla);
        return true
    }

    proximaCasilla(casilla){
        // Template Method. Devolver la casilla a la que se va a avanzar
        return this.direccionCasilla.proximaCasilla(casilla);
    }

    textoAMostrar(){
        // Template Method. Para mostrar mensaje descriptivo al no poder avanzar
        return this.direccionCasilla.textoAMostrar();
    }

    vectorDireccion(){
        return this.direccionCasilla.vectorDireccion;
    }
}

class DirCasillaDerecha  {
    vectorDireccion = { x: 1, y: 0 };

    proximaCasilla(casilla){
        return casilla.casillaASuDerecha();
    }
    textoAMostrar(){
        return "la derecha";
    }
    distancia(movimiento){
        return movimiento.distanciaHorizontal();
    }
}

class DirCasillaArriba {
    vectorDireccion = { x: 0, y: 1 };

    proximaCasilla(casilla){
        return casilla.casillaDeArriba();
    }
    textoAMostrar(){
        return "arriba";
    }
    distancia(movimiento){
        return movimiento.distanciaVertical();
    }
}

class DirCasillaAbajo {
    vectorDireccion = { x: 0, y: -1 };

    proximaCasilla(casilla){
        return casilla.casillaDeAbajo();
    }
    textoAMostrar(){
        return "abajo";
    }
    distancia(movimiento){
        return movimiento.distanciaVertical();
    }
}

class DirCasillaIzquierda {
    vectorDireccion = { x: -1, y: 0 };

    proximaCasilla(casilla){
        return casilla.casillaASuIzquierda();
    }
    textoAMostrar(){
        return "la izquierda";
    }
    distancia(movimiento){
        return movimiento.distanciaHorizontal();
    }
}

class MoverACasillaDerecha extends MovimientoEnCuadricula {
  direccionCasilla = new DirCasillaDerecha();
}
class MoverACasillaArriba extends MovimientoEnCuadricula {
  direccionCasilla = new DirCasillaArriba();
}
class MoverACasillaAbajo extends MovimientoEnCuadricula {
  direccionCasilla = new DirCasillaAbajo();
}
class MoverACasillaIzquierda extends MovimientoEnCuadricula {
  direccionCasilla = new DirCasillaIzquierda();
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

class SiguienteFila extends MoverACasillaAbajo {
  configurarVerificaciones() {
    super.configurarVerificaciones();
    this.verificacionesPre.push(new Verificacion(() => this.receptor.casillaActual().esInicio(), "No puedo ir desde acá, tengo que estar al inicio de la fila"));
  }
}

class SiguienteColumna extends MoverACasillaDerecha {
  configurarVerificaciones() {
    super.configurarVerificaciones();
    this.verificacionesPre.push(new Verificacion(() => this.receptor.casillaActual().esInicio(), "No puedo ir desde acá, tengo que estar al inicio de la columna"));
  }
}

/**
 * Comportamiento que extiende un movimiento por la cuadrícula
 * con una lectura. El actor receptor debe tener definida la propiedad
 * 'cuadriculaLectura'. Si en la casilla de llegada hay un actor Letra,
 * su contenido se registra en la cuadrícula de lectura del receptor.
 */
class MovimientoConLectura extends MovimientoEnCuadricula {
    postAnimacion() {
        super.postAnimacion();
        let casilla = this.receptor.casillaActual();
        if (this.hayLetra(casilla)) {
            let caracter = this.caracterEnCasilla(casilla);
            let casillaLectura = this.receptor.cuadriculaLectura.proximaCasillaLibre();
            if (casillaLectura) {
                this.receptor.cuadriculaLectura.agregarActorEnProximaCasillaLibre(new Letra(caracter));
            }
            else {
                throw new ActividadError("Ya leí mucho, ¡estoy cansado!");
            }
        }
    }

    hayLetra(casilla) {
        return casilla.tieneActorConEtiqueta('Letra');
    }

    caracterEnCasilla(casilla) {
        return casilla.actoresConEtiqueta('Letra')[0].caracter();
    }
}

class MoverLeyendoDerecha extends MovimientoConLectura {
    direccionCasilla = new DirCasillaDerecha();
}
class MoverLeyendoArriba extends MovimientoConLectura {
    direccionCasilla = new DirCasillaArriba();
}
class MoverLeyendoAbajo extends MovimientoConLectura {
    direccionCasilla = new DirCasillaAbajo();
}
class MoverLeyendoIzquierda extends MovimientoConLectura {
    direccionCasilla = new DirCasillaIzquierda();
}
