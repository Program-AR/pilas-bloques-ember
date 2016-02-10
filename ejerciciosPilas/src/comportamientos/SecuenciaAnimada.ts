/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>

// Decorator de la Secuencia
class SecuenciaAnimada extends ComportamientoAnimado {
	laSecuenciaPosta;

	iniciar(receptor){
		super.iniciar(receptor);
		this.laSecuenciaPosta = new Secuencia(this.argumentos);
		this.laSecuenciaPosta.iniciar(receptor);
	}

	doActualizar(){
		super.doActualizar();
		return this.laSecuenciaPosta.actualizar();
	}
}