/*
Implementa un objeto que puede ser observado por otros, es decir,
implementa la interfaz registrarObservador y tuObservadorCambio,
que avisa a los observadores sobre el cambio
*/

class Observado  {
	//atributo
    observadores;
   	atributo;
    constructor(valorInicial) {
        //super(x, y, {grilla: 'mock_caballero.png', cantColumnas:1});
        //this.escala_x = 0.05;
        //this.escala_y = 0.05;
        this.atributo=valorInicial;
        this.observadores=[];
    }

    registrarObservador(observador){
    	this.observadores.push(observador);

    }

    changed(){
    	//TODO:reemplazar con foreach

    	for(var index =0;index<this.observadores.length;index++){
    		this.observadores[index].tuObservadoCambio(this);
    	}

    }

    dameAtributo(){
    	return this.atributo;
    }
}



class ObservadoConAumentar extends Observado{

  aumentar(valorAumento){
    this.atributo=this.atributo + valorAumento;
    this.changed();
  }

}
