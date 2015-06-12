/// <reference path="Cuadricula.ts"/>
/// <reference path="Casilla.ts"/>

/**
 * class @Camino
 * El camino se construye parecido a la cuadrícula, sólo que no se indica
 * la cantidad de filas y ccolumnas, sino directamente las direcciones que
 * lo definen (arriba ^ , abajo v , izquierda <- , derecha ->).
 *
 * Las opciones que recibe son también 2 diccionarios: 1 para el camino, 1 para
 * cada casilla.
 * Las casillas deben tener sí o sí un
 * Esto es hasta que pilas resuelva el bug #
 *
 *
 */
/*
class Camino extends Cuadricula {
    puntos:[Punto];
    puntoActual;

    constructor(x, y, direcciones:[String], opcionesCuadricula, opcionesCasilla){
    	this.puntoActual = new Punto(0,0);
    	this.puntos = this.puntosPara(direcciones);
    	super(x, y, this.cantFilasCamino(), this.cantColumnasCamino(), opcionesCuadricula, opcionesCasilla);

    	this.construirCamino();
    }

    puntosPara(direcciones){
		return direcciones.map(dir => this.nuevoPuntoPara(dir));
    }

    nuevoPuntoPara(dir){
    	this.puntoActual = this.puntoActual.siguienteEn(dir);
    	return this.puntoActual;
    }

    construirCamino(){
    	var thiss = this;
    	this.puntos.forEach(function(punto){
    		punto.cambiarOrigenDeCoordenadas(thiss.minimoX(),thiss.maximoY());
    		punto.invertirY();
    	});

    	this.casillas.slice(0).filter(c => !this.laNecesito(c)).forEach(c => this.eliminarCasilla(c));
    }

    laNecesito(c:Casilla){
    	return this.puntos.some(p => c.sos(p.x,p.y));
    }

    eliminarCasilla(c:Casilla){
    	this.casillas = this.casillas.splice(this.casillas.indexOf(c),1);
    	c.eliminar();
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
}*/
