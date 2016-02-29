/// <reference path="ElMonoQueSabeContar.ts"/>

class ElMonoCuentaDeNuevo extends ElMonoQueSabeContar {
	iniciar(){
		super.iniciar();
		this.tableros.largoFila = new Tablero(0, 210, { texto: "Largo Fila Actual" });
		
	}
	cambiarImagenesFin() {
		//No hace nada
	}
}