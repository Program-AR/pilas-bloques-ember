/// <reference path="ElMonoQueSabeContar.ts"/>

class ElMonoCuentaDeNuevo extends ElMonoQueSabeContar {
	automata;

	iniciar(){ // TODO: DEMASIADO SELF MODIFICATION E INTROSPECTION
		super.iniciar();
		this.tableros.largoFila = new Tablero(0, 210, { texto: "Largo Columna Actual" , atributoObservado: 'largoColumnaActual2'});

		Trait.toObject(Observado, this.automata);
		this.automata.largoColumnaActual2 = function(){ return this.largoColumnaActual() - 1;};
		this.automata.registrarObservador(this.tableros.largoFila);
		this.automata.setCasillaActualViejo = this.automata.setCasillaActual;
		this.automata.setCasillaActual = function (c,m){
			this.setCasillaActualViejo(c,m);
			this.changed();
		}
		this.automata.changed();
	}
	cambiarImagenesFin() {
		//No hace nada
	}
}
