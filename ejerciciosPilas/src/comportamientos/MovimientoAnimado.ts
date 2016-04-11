/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoConVelocidad.ts"/>


/**
 * @class MovimientoAnimado
 *
 * Argumentos:
 *    distancia: la distancia deseada de recorrer
 *    destino: alternativamente se puede proveer un objeto con x e y, que es el destino.
 *       NOTA: Si se proveen ambos distancia y destino, deben concordar, sino no se
 *              garantiza el comportamiento correcto del Movimiento.
 *    direccion: Sino, se puede proveer una direccion de movimiento. (instancia de Direc)
 *    velocidad: Es un porcentaje. 100 significa lo más rápido. Debe ser 1 ó más.
 *               Representa la cantidad de ciclos que efectivamente se ejecutan.
 *    cantPasos: Mayor cantidad de pasos implica mayor "definicion" del movimiento.
 *               Tambien tarda mas en completarse. Jugar tambien con la velocidad.
 *               Como esto juega con la animacion, es preferible no tocarlo.
 */
class MovimientoAnimado extends ComportamientoConVelocidad {
	vectorDeAvance;
	valoresFinales : any = {};

	nombreAnimacion(){
        return 'correr';
    }

    preAnimacion(){
		super.preAnimacion();
		this.sanitizarArgumentos();
		this.vectorDeAvance = this.valoresFinales.direccion.destinyFrom(
			{x:0,y:0},
			this.valoresFinales.distancia / this.valoresFinales.cantPasos);
		this.receptor.suspenderHabilidadesConMovimiento();
		this.voltearSiCorresponde();
    }

    postAnimacion(){
		this.receptor.activarHabilidadesConMovimiento();
    }

 	darUnPaso(){
		  this.receptor.x += this.vectorDeAvance.x;
		  this.receptor.y += this.vectorDeAvance.y;
 	}

 	setearEstadoFinalDeseado(){
		  this.receptor.x = this.valoresFinales.destino.x;
		  this.receptor.y = this.valoresFinales.destino.y;
 	}

    sanitizarArgumentos(){
		this.valoresFinales.distancia = this.argumentos.distancia || this.calcularDistancia();
		if (this.argumentos.direccion !== undefined && !(this.argumentos.direccion instanceof Direct)) throw new ArgumentError("Direction should come as an instance of Direct");
		this.valoresFinales.direccion = this.argumentos.direccion || this.calcularDireccion();
		this.valoresFinales.destino = this.argumentos.destino || this.calcularDestino();
		this.valoresFinales.cantPasos = this.argumentos.cantPasos || 10;
		this.valoresFinales.velocidad = this.argumentos.velocidad || 20;
		this.valoresFinales.voltearAlIrAIzquierda = this.argumentos.voltearAlIrAIzquierda !== false;
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

    voltearSiCorresponde() {
		this.receptor.espejado = this.valoresFinales.voltearAlIrAIzquierda && this.vectorDeAvance.x < 0;
	}
}

class Direct{
	versor;
	constructor(origin, destiny = undefined){
		if(destiny === undefined){ //Means I've got degrees
			var angle = origin * Math.PI / 180;
			this.versor = { x: Math.cos(angle), y: Math.sin(angle) };
		} else if (!origin.x) { //Means I've got numbers
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
