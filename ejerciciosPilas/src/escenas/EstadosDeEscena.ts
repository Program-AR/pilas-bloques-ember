/// <reference path = "EscenaActividad.ts" />

class ErrorEnEstados {
  estadoAlQueVuelve;
  mensajeError;

  constructor(estado,mensaje){
    this.estadoAlQueVuelve=estado;
    this.mensajeError=mensaje;
  }

  ejecutarComportamiento(comportamiento) {
    throw new ActividadError(this.mensajeError);
  }

  estadoSiguiente(comportamiento,estadoAnterior){
    return estadoAnterior;
  }


}

class Estado {
  transiciones;
  identifier;

  constructor(idEstado){
    this.identifier=idEstado;
    this.transiciones={};
  }

  agregarTransicion(estadoEntrada, idTransicion, condicionTransicion = () => true) {
    this.transiciones[idTransicion] = { 
      estadoEntrada: estadoEntrada,
      condicionTransicion: condicionTransicion,
    };
  }

  realizarTransicion(idTransicion, comportamiento) {
    if (!this.transiciones[idTransicion]) throw new ActividadError("¡Ups, esa no era la opción correcta!");
    pilas.escena_actual().estado = this.estadoSiguiente(comportamiento, idTransicion);
  }

  estadoSiguiente(comportamiento, idTransicion) {
      return comportamiento.debeEjecutarse() && this.transiciones[idTransicion].condicionTransicion() ?
        this.transiciones[idTransicion].estadoEntrada :
        this;
  }

  ejecutarComportamiento(comportamiento){
    comportamiento.ejecutarse();
  }

  soyAceptacion() {
    return false;
  }
}

class EstadoAceptacion extends Estado{

  soyAceptacion(){
    return true;
  }
}

class SinEstado {
  funcionAceptacion;

  constructor(funcionAceptacion = function(escena){return false;}){
    this.funcionAceptacion=funcionAceptacion;
  }

  ejecutarComportamiento(comportamiento) {
    comportamiento.ejecutarse();
  }

  soyAceptacion(){
    return this.funcionAceptacion(pilas.escena_actual());
  }
}

class BuilderStatePattern{
    estados;
    idEstadoInicial;

    constructor(idEstadoInicialp){
      this.idEstadoInicial=idEstadoInicialp;
      this.estados={};
      this.estados[idEstadoInicialp]= new Estado(idEstadoInicialp);
    }

    agregarEstado(idEstado){
      this.estados[idEstado]= new Estado(idEstado);
    }
    agregarEstadoAceptacion(idEstado){
      this.estados[idEstado] = new EstadoAceptacion(idEstado);
    }

    agregarTransicion(estadoSalida, estadoEntrada, transicion, condicionTransicion = () => true ) {
      this.estados[estadoSalida].agregarTransicion(this.estados[estadoEntrada], transicion, condicionTransicion);
    }

    agregarError(estadoSalida,transicion,error){
      this.estados[estadoSalida].agregarTransicion(new ErrorEnEstados(this.estados[estadoSalida],error),transicion);
    }

    agregarErrorAVariosEstadosDeSalida(estadoSalida,transicion,error,indexInicialSalida,indexFinalSalida){
      //agrega un error para varios estados de salida con prefijos.
      //pre indefFinalSalida>indexInicialSalida
      var tamano=indexFinalSalida-indexInicialSalida
      for(var index=0;index<=tamano;++index){
        this.estados[estadoSalida+(indexInicialSalida+index)].agregarTransicion(new ErrorEnEstados(this.estados[estadoSalida+(indexInicialSalida+index)],error),transicion);
      }
    }
    agregarErroresIterados(estadoSalida,transicion,error,indexInicialSalida,indexFinalSalida,indexInicialTransi,indexFinalTransi){
      //pre: indexFinalSalida-indexInicialSalida= indexFinalTransi-indexInicialTransi
      // NO TERMINADO
      var range=indexFinalSalida-indexInicialSalida;
      for(var index=0;index<range;++index){
          this.estados[estadoSalida+(indexInicialSalida+index)].agregarTransicion(new ErrorEnEstados(this.estados[estadoSalida+(indexInicialSalida+index)],error),transicion);
      }
    }

    estadoInicial(){
      return this.estados[this.idEstadoInicial];
    }

    agregarEstadosPrefijados(prefix,indexInicial,indexFinal){
      //prefix debe ser string e indexInicial y final ints
    for(var i=indexInicial;i<=indexFinal;++i){
      this.estados[prefix+i]=new Estado(prefix+i);
    }
    }

    agregarTransicionesIteradas(estadoSalidaPrefix,estadoEntradaPrefix,transicion ,inicialSalida,finSalida,inicialEntrada,finEntrada){
      //pre: |estadosSalida|=|estadosEntrada|
      //implica finSalida-inicialSalida=finEntrada-InicialEntrada
      var tamano=finSalida-inicialSalida
      for(var index=0;index<=tamano;++index){
                    this.estados[estadoSalidaPrefix+(inicialSalida+index)].agregarTransicion(this.estados[estadoEntradaPrefix+(inicialEntrada+index)],transicion);
      }
    }
}
