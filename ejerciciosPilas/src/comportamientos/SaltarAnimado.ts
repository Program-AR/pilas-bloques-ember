/// <reference path = "ComportamientoConVelocidad.ts"/>

class SaltarAnimado extends ComportamientoConVelocidad {
	alTerminar;
	suelo;
	velocidad_inicial;
	velocidad_vertical;
	gravedad;

	preAnimacion() {
		super.preAnimacion();
		this.sanitizarArgumentosSaltar();
		this.suelo = this.receptor.y;
		this.velocidad_vertical = this.velocidad_inicial;
		pilas.sonidos.cargar('saltar.wav').reproducir();
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
		return (cps * v - h) / ((cps-1) * cps/2);
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

		return v;
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
		this.receptor.y += this.velocidad_vertical;
		this.velocidad_vertical -= this.gravedad;
	}

	setearEstadoFinalDeseado(){
		this.receptor.y = this.suelo;
		this.alTerminar.call(this.receptor);
	}

	nombreAnimacion(){
		return "saltar";
	}
}
