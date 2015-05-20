class Estado{
  transiciones;
  errores;
  identifier;
  constructor(idEstado){
    this.identifier=idEstado;
    this.errores={};
    this.transiciones={};
  }

  agregarTransicion(estadoEntrada,transicion){
    this.transiciones[transicion]= estadoEntrada;
  }

  agregarError(transicion,error){
    this.errores[transicion]=error;

  }

  errorAlIntentar(idComportamiento){
     return this.errores[idComportamiento] || "Esa acción no esta permitida en este momento";
  }

  admiteTransicion(idComportamiento){
    return this.transiciones[idComportamiento]!=null;
  }

  siguiente(idComportamiento){
    return this.transiciones[idComportamiento];
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
      this.estados[estadoSalida].agregarError(transicion,error);
    }

    estadoInicial(){
      return this.estados[this.idEstadoInicial];
    }


}

class estadoDummy extends Estado{
  admiteTransicion(a){
    return true;
  }
  siguiente(a){
    return this;
  }


}
