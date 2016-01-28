/// <reference path="MarcianoAnimado.ts"/>

class MarcianoVerdeAnimado extends MarcianoAnimado {
	opcionesImagen() {
		return { grilla: 'marcianoVerdeAnimado.png', cantColumnas: 6, cantFilas: 6 };
    }

    animacionesAdicionales(){
		this.definirAnimacion("recogerHierro", [13, 14, 15], 5);
        this.definirAnimacion("recogerCarbon", [24, 25, 26], 5);
				this.definirAnimacion("recogerNaranja", [24, 25, 26], 5);

    }
}
