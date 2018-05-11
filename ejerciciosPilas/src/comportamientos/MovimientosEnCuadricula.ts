/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>
/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/Casilla.ts" />

type vectorDireccion = {x: number, y: number};

class MovimientoEnCuadricula extends MovimientoAnimado {
    cuadricula : Cuadricula;
    casillaOrigen : Casilla;
    casillaDestino : Casilla;
    direccionCasilla : DireccionCasilla ; // Strategy

    iniciar(receptor : ActorAnimado) : void {
        super.iniciar(receptor);
        
        this.cuadricula = this.receptor.cuadricula;
    
        if (!this.direccionCasilla) {
          let clase:any = window[this.argumentos.claseDirCasilla];
          this.direccionCasilla = new clase();
        }
        
        this.casillaOrigen = this.casillaActual();
        this.casillaDestino = this.proximaCasilla(this.casillaOrigen) || this.casillaOrigen;

        this.argumentos.direccion = new Direct(this.vectorDireccion().x, this.vectorDireccion().y);
        this.argumentos.distancia = this.distancia();
    }

    casillaActual() : Casilla {
        return this.receptor.casillaActual();
    }

    proximaCasilla(casilla : Casilla) : Casilla {
        // Template Method. Devolver la casilla a la que se va a avanzar
        return this.direccionCasilla.proximaCasilla(casilla);
    }

    vectorDireccion() : vectorDireccion {
        return this.direccionCasilla.vectorDireccion;
    }

    distancia() : number {
        // Template Method. Devuelve la distancia vertical ú horizontal según corresponda
        return this.direccionCasilla.distancia(this) - (
            this.hayObstaculo(this.casillaDestino)
                ? this.direccionCasilla.distanciaUnaCasilla(this) * 0.3
                : 0
            );
    }

    distanciaHorizontal() : number {
        return this.cuadricula.anchoCasilla() + this.cuadricula.separacion();
    }

    distanciaVertical() : number {
        return this.cuadricula.altoCasilla() + this.cuadricula.separacion();
    }

    hayObstaculo(casilla : Casilla) : boolean {
        return casilla.tieneActorConEtiqueta('Obstaculo');
    }


    configurarVerificaciones() : void {
        super.configurarVerificaciones();
        this.verificacionesPre.push(new Verificacion(
            () => this.verificarDireccion(),
            "No puedo ir para " + this.textoAMostrar()
        ));
        this.verificacionesPost.push(new Verificacion(
            () => ! this.hayObstaculo(this.casillaDestino),
            "¡Hay un obstáculo!"
        ));
    }

    verificarDireccion() : boolean {
        return this.proximaCasilla(this.casillaOrigen) !== undefined;
    }

    textoAMostrar() : string {
        // Template Method. Para mostrar mensaje descriptivo al no poder avanzar
        return this.direccionCasilla.textoAMostrar();
    }


    postAnimacion() : void {
        this.receptor.setCasillaActual(this.casillaDestino);
    }


    nombreAnimacion() : string {
        return this.hayObstaculo(this.casillaDestino)
            ? "correrChocando"
            : super.nombreAnimacion();        
    }

    nombreAnimacionSiguiente() : string {
        return this.hayObstaculo(this.casillaDestino)
            ? "chocado"
            : super.nombreAnimacionSiguiente();
    }
}

interface DireccionCasilla {
    vectorDireccion : vectorDireccion;
    proximaCasilla(casilla : Casilla) : Casilla;
    textoAMostrar() : string;
    distanciaUnaCasilla(movimiento : MovimientoEnCuadricula) : number;
    distancia(movimiento : MovimientoEnCuadricula) : number;
}


class DirCasillaDerecha implements DireccionCasilla {
    vectorDireccion = { x: 1, y: 0 };

    proximaCasilla(casilla){
        return casilla.casillaASuDerecha();
    }
    textoAMostrar(){
        return "la derecha";
    }
    distanciaUnaCasilla(movimiento){
        return movimiento.distanciaHorizontal();
    }
    distancia(movimiento) {
        return this.distanciaUnaCasilla(movimiento);
    }
}

class DirCasillaArriba implements DireccionCasilla {
    vectorDireccion = { x: 0, y: 1 };

    proximaCasilla(casilla){
        return casilla.casillaDeArriba();
    }
    textoAMostrar(){
        return "arriba";
    }
    distanciaUnaCasilla(movimiento){
        return movimiento.distanciaVertical();
    }
    distancia(movimiento) {
        return this.distanciaUnaCasilla(movimiento);
    }
}

class DirCasillaAbajo implements DireccionCasilla {
    vectorDireccion = { x: 0, y: -1 };

    proximaCasilla(casilla){
        return casilla.casillaDeAbajo();
    }
    textoAMostrar(){
        return "abajo";
    }
    distanciaUnaCasilla(movimiento){
        return movimiento.distanciaVertical();
    }
    distancia(movimiento) {
        return this.distanciaUnaCasilla(movimiento);
    }
}

class DirCasillaIzquierda implements DireccionCasilla {
    vectorDireccion = { x: -1, y: 0 };

    proximaCasilla(casilla){
        return casilla.casillaASuIzquierda();
    }
    textoAMostrar(){
        return "la izquierda";
    }
    distanciaUnaCasilla(movimiento){
        return movimiento.distanciaHorizontal();
    }
    distancia(movimiento) {
        return this.distanciaUnaCasilla(movimiento);
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


class DirTodoADerecha extends DirCasillaDerecha {
    proximaCasilla(casilla) {
        return casilla.casillaTodoADerecha();
    }
    distancia(movimiento) {
        return movimiento.distanciaHorizontal()
               * (movimiento.cuadricula.cantColumnas - 1 - movimiento.casillaActual().nroColumna);
    }
}

class DirTodoArriba extends DirCasillaArriba {
    proximaCasilla(casilla) {
        return casilla.casillaTodoArriba();
    }
    distancia(movimiento) {
        return movimiento.distanciaVertical() * movimiento.casillaActual().nroFila;
    }
}

class DirTodoAbajo extends DirCasillaAbajo {
    proximaCasilla(casilla) {
        return casilla.casillaTodoAbajo();
    }
    distancia(movimiento) {
        return movimiento.distanciaVertical()
               * (movimiento.cuadricula.cantFilas - 1 - movimiento.casillaActual().nroColumna);
    }
}

class DirTodoAIzquierda extends DirCasillaIzquierda {
    proximaCasilla(casilla) {
        return casilla.casillaTodoAIzquierda();
    }
    distancia(movimiento) {
        return movimiento.distanciaHorizontal() * movimiento.casillaActual().nroColumna;
    }
}

class MoverTodoADerecha extends MovimientoEnCuadricula {
    direccionCasilla = new DirTodoADerecha();
}
class MoverTodoArriba extends MovimientoEnCuadricula {
    direccionCasilla = new DirTodoArriba();
}
class MoverTodoAbajo extends MovimientoEnCuadricula {
    direccionCasilla = new DirTodoAbajo();
}
class MoverTodoAIzquierda extends MovimientoEnCuadricula {
    direccionCasilla = new DirTodoAIzquierda();
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
