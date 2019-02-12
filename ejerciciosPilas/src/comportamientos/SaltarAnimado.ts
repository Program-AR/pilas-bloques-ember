/// <reference path = "MovimientoAnimado.ts"/>

class SaltarAnimado extends MovimientoAnimado {
	alTerminar;
	velocidad_inicial;
	velocidad_vertical;
	gravedad;
	vectorDeAvanceOriginal;

	preAnimacion() {
		if(this.argumentos.distancia === undefined && this.argumentos.direccion === undefined){
			// Significa que me llamaron sin los parámetros del movimiento.
			this.argumentos.distancia = 0;
			this.argumentos.direccion = new Direct(0,1); // No importa
		};
		this.argumentos.distancia = this.receptor.escena.longitudSegmento || this.argumentos.distancia;
		super.preAnimacion();
		this.sanitizarArgumentosSaltar();
		this.velocidad_vertical = this.velocidad_inicial;
		pilas.sonidos.cargar('libs/data/audio/saltar.wav').reproducir();
		this.vectorDeAvanceOriginal = {x: this.vectorDeAvance.x, y: this.vectorDeAvance.y};
	}

	sanitizarArgumentosSaltar(){
		this.alTerminar = this.argumentos.alTerminar || function(r) { };
		this.gravedad = this.argumentos.gravedad || this.calcularGravedad();
		this.velocidad_inicial = this.argumentos.velocidad_inicial || this.calcularVInicial();
	}

	calcularGravedad(){
		// calculo gravedad porque no vino por argumento.
		if (!this.argumentos.velocidad_inicial || !this.argumentos.alturaDeseada)
			throw new ArgumentError('Si no se proporciona gravedad, debe proporcionarse velocidad inicial y la altura deseada');

		if (this.argumentos.velocidad_inicial * this.argumentos.cantPasos / 2 < this.argumentos.alturaDeseada)
			throw new ArgumentError('Velocidad inicial insuficiente para llegar a la altura deseada en los pasos indicados');

		// justificación de esto abajo
		var cps = this.argumentos.cantPasos / 2;
		var v = this.argumentos.velocidad_inicial;
		var h = this.argumentos.alturaDeseada;
		return Math.floor((cps * v - h) / ((cps-1) * cps/2)); //Es preferible manejar siempre enteros.
		                    //Redondear para abajo se compensa con setearEstadoFinalDeseado
	}

	calcularVInicial(){
		if (!this.argumentos.alturaDeseada)
			throw new ArgumentError('Si no se proporciona velocidad inicial, debe proporcionarse la gravedad y la altura deseada');

		// justificación de esto abajo
		var cps = this.argumentos.cantPasos / 2;
		var g = this.gravedad;
		var h = this.argumentos.alturaDeseada;
		var v = g/2 * (cps-1) + (h/cps);

		if (v < 0)
			throw new ArgumentError('Gravedad insuficiente para llegar a la altura deseada en los pasos indicados');

		return Math.floor(v); //Es preferible manejar siempre enteros.
		                    //Redondear para abajo se compensa con setearEstadoFinalDeseado
	}
		/* Fumata:

		 h es altura, v es velocidad inicial, g es gravedad, cps es cantidad de pasos para la subida.
		Mirando darUnPaso, y teniendo en cuenta que la velocidad vertical va disminuyendo relativa a la anterior,
		 el cálculo que hay que hacer para calcular h es:

		h = v +
		    v - g +
				v - g - g +
				v - g - g - g +
				..... cps veces.

		Entonces, siendo E() sumatoria de i = 0 a cps - 1
		h = E (v - g * i)
		Sacando la constante v de la sumatoria:
		h = cps * v + E (- g * i)
		Factor común -g
		h = cps * v - g * E (i)
		x Gauss
		h = cps * v - g * ((cps-1+0) * cps/2) --->>> si cps es par
		h = cps * v - g * ((cps-1) * cps/2) -> de acá sale la altura a partir de velocidad inicial y gravedad

		De donde sale que la gravedad g es:
		g * ((cps-1) * cps/2) = cps * v - h
		g = (cps * v - h) / ((cps-1) * cps/2) -> de acá sale la gravedad a partir de altura y velocidad inicial

		Y de donde sale que v es:
		g * ((cps-1) * cps/2) = cps * v - h
		g * ((cps-1) * cps/2) + h = cps * v
		(g * ((cps-1) * cps/2) + h ) / cps = v
		Masajeo:
		g * ((cps-1) * cps/2) / cps + h / cps = v
		g * ((cps-1) /2) + h / cps = v
		g/2 * (cps-1) + h / cps = v -> -> de acá sale la velocidad a partir de altura y gravedad
		*/


	darUnPaso() {
		this.vectorDeAvance.y = this.vectorDeAvanceOriginal.y + this.velocidad_vertical;
		super.darUnPaso();
		this.velocidad_vertical -= this.gravedad;
	}

	setearEstadoFinalDeseado(){
		super.setearEstadoFinalDeseado();
		this.alTerminar.call(this.receptor);
	}

	nombreAnimacion(){
		return this.argumentos.nombreAnimacion || "saltar";
	}
}

class SaltarHaciaAdelante extends SaltarAnimado{
	preAnimacion(){
		this.argumentos.direccion = new Direct(this.receptor.rotacion);
		super.preAnimacion();
	}
}