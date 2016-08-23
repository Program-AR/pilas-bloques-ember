/// <reference path = "ComportamientoAnimado.ts"/>

/**
 * @class ComportamientoConVelocidad
 *
 * Argumentos:
 *    velocidad: Es un porcentaje. 100 significa lo más rápido. Debe ser 1 ó más.
 *               Representa la cantidad de ciclos que efectivamente se ejecutan.
 *    cantPasos: Mayor cantidad de pasos implica mayor "definicion" del movimiento.
 *               Tambien tarda mas en completarse. Jugar tambien con la velocidad.
 *               Como esto juega con la animacion, es preferible no tocarlo.
 */
class ComportamientoConVelocidad extends ComportamientoAnimado {
	pasosRestantes;
	vueltasSinEjecutar;
	enQueVueltaEjecuto;

	preAnimacion(){
		super.preAnimacion();
		this.argumentos.cantPasos = this.argumentos.cantPasos || 10;
		this.argumentos.velocidad = this.argumentos.velocidad || 20;

		this.vueltasSinEjecutar = 0;
		this.enQueVueltaEjecuto = Math.round(100 / this.velocidad());
		this.pasosRestantes = this.argumentos.cantPasos;
  }

	velocidad(){
		return this.argumentos.velocidad;
	}

  doActualizar(){
		var terminoAnimacion = super.doActualizar();
    	if (this.pasosRestantes <= 0) {
			this.setearEstadoFinalDeseado();
			return terminoAnimacion;
		} else if (this.deboEjecutar()) { // para definir la velocidad de tick
			this.darUnPaso();
			this.pasosRestantes -= 1;
		}
 	}

 	deboEjecutar(){ // Aca entra en juego la velocidad
		  if (this.vueltasSinEjecutar + 1 == this.enQueVueltaEjecuto){
			  this.vueltasSinEjecutar = 0;
			  return true;
		  } else {
 		      this.vueltasSinEjecutar += 1;
			  return false;
		  }
 	}

 	darUnPaso(){
		// Debe redefinirse. Es el comportamiento a realizar en cada tick.
 	}

    setearEstadoFinalDeseado(){
	    // Debe redefinirse. Sirve para asegurar que al terminar los pasos se llegue al estado deseado
	    // Por ejemplo, si me estoy moviendo a un lugar, setear ese lugar evita problemas de aproximación parcial.
    }

}
