/// <reference path = "EscenaDuba.ts" />
/// <reference path = "EscenaCoty.ts" />
/// <reference path = "EscenaLita.ts" />
/// <reference path = "EscenaTotoLector.ts" />
/// <reference path = "EscenaTotoEscritor.ts" />


class EscenaDubaFondoBlanco extends EscenaDuba {
	archivoFondo(): string {
		return "fondo.blanco.png";
	}
}

class EscenaCotyFondoBlanco extends EscenaCoty {
	static pathFondo(): string {
		return "fondo.blanco.png";
	}
}

class EscenaLitaFondoBlanco extends EscenaLita {
	archivoFondo(): string {
		return "fondo.blanco.png";
	}
}

class EscenaTotoLectorFondoBlanco extends EscenaTotoLector {
	archivoFondo(): string {
		return "fondo.blanco.png";
	}
}

class EscenaTotoEscritorFondoBlanco extends EscenaTotoEscritor {
	archivoFondo(): string {
		return "fondo.blanco.png";
	}
}
