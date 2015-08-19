/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>


/**
 * @class MovimientoAnimado
 * 
 * Argumentos:
 *    distancia: la distancia deseada de recorrer
 *    destino: alternativamente se puede proveer un objeto con x e y, que es el destino. 
 *    direccion: Sino, se puede proveer una direccion de movimiento. (instancia de Direc)
 *    velocidad: Es un porcentaje. 100 significa lo más rápido. Debe ser 1 ó más.
 *               Representa la cantidad de ciclos que efectivamente se ejecutan.
 *    cantPasos: Mayor cantidad de pasos implica mayor "definicion" del movimiento. 
 *               Tambien tarda mas en completarse. Jugar tambien con la velocidad.
 *               Como esto juega con la animacion, es preferible no tocarlo.
 */
class MovimientoAnimado extends ComportamientoAnimado{
	pasosRestantes;
	vectorDeAvance;
	vueltasSinEjecutar;
	enQueVueltaEjecuto;

	nombreAnimacion(){
        return 'correr';
    }

    alIniciar(){
		super.alIniciar();
		this.sanitizarArgumentos();
		this.vueltasSinEjecutar = 0;
		this.enQueVueltaEjecuto = Math.round(100/this.argumentos.velocidad);
		this.pasosRestantes = this.argumentos.cantPasos;
		this.vectorDeAvance = this.argumentos.direccion.destinyFrom(
			{x:0,y:0},
			this.argumentos.distancia / this.argumentos.cantPasos);
    }

    doActualizar(){
		var terminoAnimacion = super.doActualizar();
    	if (this.pasosRestantes <= 0) {
			this.receptor.x = this.argumentos.destino.x;
			this.receptor.y = this.argumentos.destino.y;
			return terminoAnimacion;
		} else if (this.deboEjecutar()) { // para definir la velocidad de movimiento
			this.darUnPaso();
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
		  this.pasosRestantes -= 1;
		  this.receptor.x += this.vectorDeAvance.x;
		  this.receptor.y += this.vectorDeAvance.y;
 	}

    sanitizarArgumentos(){
		if (this.argumentos.distancia !== undefined && this.argumentos.destino !== undefined) throw new ArgumentError("Distance or destiny shouldn't be both arguments");
		this.argumentos.distancia = this.argumentos.distancia || this.calcularDistancia();
		if (this.argumentos.direccion !== undefined && !(this.argumentos.direccion instanceof Direct)) throw new ArgumentError("Direction should come as an instance of Direct");
		this.argumentos.direccion = this.argumentos.direccion || this.calcularDireccion();
		this.argumentos.destino = this.argumentos.destino || this.calcularDestino();
		this.argumentos.cantPasos = this.argumentos.cantPasos || 10;
		this.argumentos.velocidad = this.argumentos.velocidad || 20;
    }

    calcularDistancia(){
    	if (!this.argumentos.destino) throw new ArgumentError("Distance or destiny missing");
		return pilas.utils.distancia_entre_dos_actores(this.receptor, this.argumentos.destino);
    }

    calcularDireccion(){
    	if (!this.argumentos.destino) throw new ArgumentError("Direction or destiny missing");
		return new Direct(this.receptor, this.argumentos.destino);
    }

    calcularDestino(){
		return this.argumentos.direccion.destinyFrom(this.receptor, this.argumentos.distancia);
    }
}

class Direct{
	versor;
	constructor(origin,destiny){
		if (!origin.x) { //Means I've got numbers
			this.versor = Direct.versorFor({ x: origin, y: destiny });
		} else { //Means i've got points or objects with x and y
			this.versor = Direct.versorFor({ x: destiny.x - origin.x, y: destiny.y - origin.y });
		}
	}

	static versorFor(vector){
		var norm = Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
		return { x: vector.x/norm, y: vector.y/norm };
	}

	destinyFrom(point, distance){
		return {x: point.x + (this.versor.x * distance), 
				y: point.y + (this.versor.y * distance) }
	}
}

class ArgumentError implements Error{
	name;
	message;
	constructor(description){
		this.name = "ArgumentError";
		this.message = description;
	}
}