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