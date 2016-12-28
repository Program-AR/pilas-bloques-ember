/// <reference path = "../comportamientos/MovimientoAnimado.ts" />

// Si se pasa por argumento "escaparCon" entonces el receptor debe ser actor compuesto
class Escapar extends MovimientoAnimado {

	iniciar(receptor){
		this.argumentos.idTransicion = "escapar";
		super.iniciar(receptor);
	}

	preAnimacion(){
	    this.argumentos.direccion = new Direct(1, 5);
	    this.argumentos.distancia = 600;
	    this.argumentos.velocidad = 8;
	    this.argumentos.cantPasos = 40;
	    if (this.argumentos.escaparCon) this.receptor.agregarSubactor(this.argumentos.escaparCon);
	    super.preAnimacion();
	}

	configurarVerificaciones() {
		super.configurarVerificaciones();
		this.verificacionesPre.push(new Verificacion(() => this.estaEnTransporte(), "Para escapar hace falta un transporte"));
	}

	estaEnTransporte(){
		return !this.argumentos.escaparCon || this.receptor.colisiona_con(this.argumentos.escaparCon);
	}
}
