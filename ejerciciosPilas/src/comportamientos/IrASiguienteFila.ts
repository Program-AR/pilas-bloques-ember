class IrASiguienteFila extends ComportamientoAnimado {
  nombreAnimacion(){
    // redefinir por subclase
    return "parado";
  }

  postAnimacion(){
    var nroF=this.argumentos['personaje'].casilla.nroFila+1;
    this.argumentos['personaje'].casilla=this.argumentos['cuadricula'].casilla(nroF,0);
  }
}
