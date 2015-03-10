/// <reference path="Cuadricula.ts"/>

class Camino extends Cuadricula {
    puntos:[Punto];
    puntoActual;
    
    constructor(x, y, direcciones:[String], opcionesCuadricula, opcionesCasilla){
    	this.puntos = this.puntosPara(direcciones);
    	super(x, y, this.cantFilasCamino(), this.cantColumnasCamino(), opcionesCuadricula, opcionesCasilla);
    	
    	this.construirCamino();
    }
    
    puntosPara(direcciones){
		return direcciones.map(this.nuevoPuntoPara);
    }
    
    nuevoPuntoPara(dir){
    	this.puntoActual = this.puntoActual.siguienteEn(dir);
    	return this.puntoActual;
    }
    
    construirCamino(){
    	//this.casillas.forEach(casilla => casilla.desHabilitar());
    	this.puntos.forEach(function(punto){ 
    		punto.cambiarOrigenDeCoordenadas(this.minimoX(),this.maximoY());
    		punto.invertirY();
    		this.casilla(punto.x,punto.y).habilitar(); 
    	});    	
    	
    }
    
    cantFilasCamino(){
		return this.maximoY() + this.maximoSegun(punto => 0-punto.y) + 1; 
    }
    cantColumnasCamino(){
    	return this.maximoSegun(punto => punto.x) - this.minimoX() + 1;
    }
    minimoX(){
    	return 0 - this.maximoSegun(punto => 0-punto.x);
    }
    maximoY(){
    	return this.maximoSegun(punto => punto.y);
    }
    
    maximoSegun(f:(p:Punto) => number){
    	return this.puntos.map(f).reduce((maximo,nro) => Math.max(maximo,nro));
    }
}

class Punto{
	x:number;
	y:number;
	static mapa = { 
		'->' : {x:1, y:0},
		'<-' : {x:-1, y:0},
		'^' : {x:0, y:1},
		'v' : {x:0, y:-1}
	};
			
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	
	siguienteEn(dir){
		return new Punto(this.x + this.avanceX(dir), this.y + this.avanceY(dir));
	}
	
	avanceX(dir){
		return Punto.mapa[dir].x;
	}
	
	avanceY(dir){
		return Punto.mapa[dir].y;
	}
	
	cambiarOrigenDeCoordenadas(nuevoX, nuevoY){
		this.x = this.x - nuevoX;
		this.y = this.y - nuevoY;
	}
	
	invertirY(){
		this.y = 0 - this.y;
	}
}