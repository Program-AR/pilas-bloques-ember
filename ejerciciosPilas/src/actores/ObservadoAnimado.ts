/*
Implementa un objeto que puede ser observado por otros, es decir,
implementa la interfaz registrarObservador y tuObservadorCambio,
que avisa a los observadores sobre el cambio
*/

class Observado  {
    observadores = [];

    registrarObservador(observador){
        this.observadores.push(observador);
        this.changed();
    }

    changed(){
    	this.observadores.forEach( o => o.tuObservadoCambio(this) );
    }
}



class ObservadoConAumentar extends Observado{
    aumentar(atributo,valorAumento) {
        this[atributo] = this[atributo] + valorAumento;
        this.changed();
    }

}


class ObservadoConDisminuir extends Observado{
    disminuir(atributo,valorDisminucion) {
        this[atributo] = this[atributo] - valorDisminucion;
        this.changed();
    }

}
