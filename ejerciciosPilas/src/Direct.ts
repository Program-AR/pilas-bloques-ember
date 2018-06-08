type PuntoSimple = { x: number, y: number };
type SegmentoSimple = { inicio: PuntoSimple, fin: PuntoSimple };

class Direct {
	versor;
	constructor(origin, destiny = undefined){
        if(!origin && origin !== 0) throw new Error("Origin of versor or degrees must be provided.");
		if(destiny === undefined){ //Means I've got degrees
			var angle = origin * Math.PI / 180;
			this.versor = { x: Math.cos(angle), y: Math.sin(angle) };
		} else if (!origin.x && origin.x !== 0) { //Means I've got numbers
			this.versor = Direct.versorFor({ x: origin, y: destiny });
		} else { //Means i've got points or objects with x and y
			this.versor = Direct.versorFor({ x: destiny.x - origin.x, y: destiny.y - origin.y });
		}
	}

	static versorFor(vector){
		var norm = Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
		if (norm > 0) {
			return { x: vector.x/norm, y: vector.y/norm };
		}
		else {
			return { x: 0, y: 0 };
		}
	}

	destinyFrom(point, distance){
		return {x: point.x + (this.versor.x * distance),
				y: point.y + (this.versor.y * distance) }
	}

	isNull() {
		return this.versor.x == 0 && this.versor.y == 0;
	}

	inverse(): Direct {
		return new Direct(this.versor.x * -1, this.versor.y * -1);
	}
	
	equals(other: Direct) {
		return this.isNull() || other.isNull() || this.versor.x == other.versor.x && this.versor.y == other.versor.y;
	}

	isParallelTo(other: Direct) {
		return this.equals(other) || this.equals(other.inverse())
	}
}

/**
 *  Possible arguments for construction:
 *    - You can provide distance (a number) and direction (an instance of Direct), or:
 *    - Tou can provide an origin and a destiny (two objects with x and y)
 *    - You can just provide the destiny, which in fact will be taken as a vector starting at (0,0).
 */
/*
class TranslationVector {
    x: number;
    y: number;
    finalValues;
    args;

    constructor(args){
        this.args = args;
        this.finalValues = {};
        this.sanitizeArgs();
        this.x = this.finalValues.destiny.x;
        this.y = this.finalValues.destiny.y;
    }
    sanitizeArgs(){
        this.finalValues.origin = this.args.origin || {x:0,y:0};
		this.finalValues.distance = this.args.distance === 0 ? 0 : this.args.distance || this.getDistance();
        if (Array.isArray(this.args.direction) && this.args.direction.length === 2) {
            this.args.direction = new Direct(this.args.direction[0], this.args.direction[1]);
        }
		if (this.args.direction !== undefined && !(this.args.direction instanceof Direct)) throw new Error("Direction should come as an instance of Direct");
		this.finalValues.direction = this.args.direction || this.getDirection();
		this.finalValues.destiny = this.args.destiny || this.getDestiny();
    }

    getDistance(){
    	if (!this.args.destiny) throw new Error("Distance or destiny missing");
		return pilas.utils.distancia_entre_dos_puntos(this.args.origin, this.args.destiny);
    }

    getDirection(){
    	if (!this.args.destiny) throw new Error("Direction or destiny missing");
		return new Direct(this.args.origin, this.args.destiny);
    }

    getDestiny(){
		return this.args.direction.destinyFrom(this.args.origin, this.args.distance);
    }
}
*/