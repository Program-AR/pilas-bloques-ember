/// <reference path = "EscenaActividad.ts" />

class ErrorEnEstados{
  estadoAlQueVuelve;
  mensajeError;

  constructor(estado,mensaje){
    this.estadoAlQueVuelve=estado;
    this.mensajeError=mensaje;
  }

  realizarAccion(comportamiento, estadoAnterior){
    throw new ActividadError(this.mensajeError);
  }

  estadoSiguiente(comportamiento,estadoAnterior){
    return estadoAnterior;
  }


}

class Estado{
  transiciones;
  identifier;

  constructor(idEstado){
    this.identifier=idEstado;
    this.transiciones={};
  }

  agregarTransicion(estadoEntrada,transicion){
    this.transiciones[transicion]= estadoEntrada;
  }

  realizarTransicion(idComportamiento,comportamiento){
    if(this.transiciones[idComportamiento]){
        pilas.escena_actual().estado=this.transiciones[idComportamiento].estadoSiguiente(comportamiento,this);
        this.transiciones[idComportamiento].realizarAccion(comportamiento,this);
    }else{
      throw new ActividadError("¡Ups, ésa no era la opción correcta!");
    }
  }

  estadoSiguiente(comportamiento,estadoAnterior){
      if(comportamiento.debeEjecutarse()){
          return this
      }else{
          return estadoAnterior;
      }
  }

  realizarAccion(comportamiento,estadoAnterior){
    comportamiento.ejecutarse()
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

	realizarTransicion(idComport,comportamiento){
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

    agregarTransicion(estadoSalida,estadoEntrada,transicion){
      this.estados[estadoSalida].agregarTransicion(this.estados[estadoEntrada],transicion);
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
