class ErrorEnEstados{
  estadoAlQueVuelve;
  mensajeError;

  constructor(estado,mensaje){
    this.estadoAlQueVuelve=estado;
    this.mensajeError=mensaje;
  }

  realizarAccion(comportamiento,estadoAnterior){
    pilas.escena_actual().personajePrincipal().decir(this.mensajeError);
    console.log(estadoAnterior.identifier)
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
    pilas.escena_actual().estado=this.transiciones[idComportamiento].realizarAccion(comportamiento,this);
  }

  realizarAccion(comportamiento,estadoAnterior){
    if(comportamiento.elEstadoEsValido()){
      return this
    }else{
      return estadoAnterior;
    }
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

    agregarTransicion(estadoSalida,estadoEntrada,transicion){
      this.estados[estadoSalida].agregarTransicion(this.estados[estadoEntrada],transicion);
    }

    agregarError(estadoSalida,transicion,error){
      this.estados[estadoSalida].agregarTransicion(new ErrorEnEstados(this.estados[estadoSalida],error),transicion);
    }

    estadoInicial(){
      return this.estados[this.idEstadoInicial];
    }


}
