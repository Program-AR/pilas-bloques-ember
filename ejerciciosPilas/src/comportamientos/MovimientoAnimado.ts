/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>


/**
 * @class MovimientoAnimado
 * 
 * Argumentos:
 *    distancia: la distancia deseada de recorrer
 *    destino: alternativamente se puede proveer un objeto con x e y
 *    cantPasos: Mayor cantidad de pasos, más tarda en llegar. 
 *        Puede pensarse como inversamente proporcional a la velocidad
 */
class MovimientoAnimado extends ComportamientoAnimado{
	pasosRestantes;
	vectorDeAvance;
	nombreAnimacion(){
        return 'correr';
    }

    alIniciar(){
		super.alIniciar();
		this.sanitizarArgumentos();
		this.pasosRestantes = this.argumentos.cantPasos;
		this.vectorDeAvance = this.argumentos.direccion.destinyFrom(
			{x:0,y:0},
			this.argumentos.distancia / this.argumentos.cantPasos);
    }

    doActualizar(){
 		super.doActualizar();
		this.darUnPaso();
 		if (this.pasosRestantes <= 0){
			this.receptor.x = this.argumentos.destino.x;
			this.receptor.y = this.argumentos.destino.y;
 			return true;
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
		this.argumentos.cantPasos = this.argumentos.cantPasos || 20;
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
		this.argumentos.destino = this.argumentos.direccion.destinyFrom(this.receptor, this.argumentos.distancia);
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
		this.message = description;
	}
}