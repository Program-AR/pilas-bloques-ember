/*
Implementa un objeto que puede ser observado por otros, es decir,
implementa la interfaz registrarObservador y tuObservadorCambio,
que avisa a los observadores sobre el cambio
*/

// Pensado para ser Trait.
class Observado  {
    observadores;

    inicializarObservadores() {
        if(!this.observadores) this.observadores = [];
    }

    registrarObservador(observador){
        this.inicializarObservadores();
        this.observadores.push(observador);
        this.changed();
    }

    changed(){
        this.inicializarObservadores(); // TODO: se puede sacar?
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
