/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>

// Decorator de la Secuencia
class SecuenciaAnimada extends ComportamientoAnimado {
	laSecuenciaPosta;

	iniciar(receptor){
    // Ver bloques de la gran aventura del mar encantado
    for(var i in this.argumentos.secuencia) {
      if(this.argumentos.secuencia[i].comportamiento) {
        var comportamiento = eval(this.argumentos.secuencia[i].comportamiento);
        this.argumentos.secuencia[i] = new comportamiento(this.argumentos.secuencia[i].argumentos);
      }
    }
		super.iniciar(receptor);
		this.laSecuenciaPosta = new Secuencia(this.argumentos);
		this.laSecuenciaPosta.iniciar(receptor);
	}

	doActualizar(){
		return this.laSecuenciaPosta.actualizar();
	}
}
