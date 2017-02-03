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

	    if (this.argumentos.escaparCon) {

        if (typeof this.argumentos.escaparCon == 'string') {
          this.argumentos.escaparCon = eval("pilas.escena_actual()." + this.argumentos.escaparCon);
        }

        this.receptor.agregarSubactor(this.argumentos.escaparCon);
      }
	    super.preAnimacion();
	}

	configurarVerificaciones() {
		super.configurarVerificaciones();
		this.verificacionesPre.push(new Verificacion(() => {
			return this.estaEnTransporte();
		}, "Para escapar hace falta un transporte"));
	}

	estaEnTransporte(){
		if (typeof this.argumentos.escaparCon == 'string') {
			this.argumentos.escaparCon = eval("pilas.escena_actual()." + this.argumentos.escaparCon);
		}

		let noTieneQueEscaparConNingunActor = (!this.argumentos.escaparCon);
		let colisionaConElActorParaEscapar = this.receptor.colisiona_con(this.argumentos.escaparCon);

		return (noTieneQueEscaparConNingunActor || colisionaConElActorParaEscapar);
	}
}
