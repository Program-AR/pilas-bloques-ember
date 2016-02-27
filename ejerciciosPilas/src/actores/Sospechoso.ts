/// <reference path="ActorAnimado.ts"/>
/// <reference path="../comportamientos/Decir.ts"/>

class Sospechoso extends ActorAnimado {
	static disfracesUsados;
	meaCulpa;

	static reiniciarDisfraces(){
		this.disfracesUsados = [];
	}

    constructor(x = 0, y = 0) {
        super(x, y, {grilla: 'sospechosos.png', cantColumnas:8});
        this.definirAnimacion("parado", [this.nroDisfraz()], 4, true);
        this.definirAnimacion("culpable", [7], 4);
    }

    nroDisfraz(){
		var disfraz = this.disfracesDisponibles()[Math.floor(Math.random() * this.disfracesDisponibles().length)];
		Sospechoso.disfracesUsados.push(disfraz);
		return disfraz;
    }

    disfracesDisponibles(){
		var disponibles = [0, 1, 2, 3, 4, 5, 6];
		Sospechoso.disfracesUsados.forEach(nro => disponibles.splice(disponibles.indexOf(nro), 1));
		return disponibles;
    }

    hacerCulpable(){
		this.meaCulpa = true;
    }

    esCulpable(){
		return this.meaCulpa;
    }

    sacarDisfraz(){
		if (this.meaCulpa) 
			this.cargarAnimacion("culpable");
    }

    mensajeAlSacarDisfraz(){
		return this.meaCulpa ? "¡Me rindo!" : "¡No estoy disfrazado, este soy yo!"
    }

    teEncontraron(){
		return this.nombreAnimacionActual() === "culpable";
    }
}
