/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "../comportamientos/SaltarHablando.ts" />
/// <reference path = "../escenas/ElObreroCopado.ts" />


/**
 * @class NoMeCansoDeSaltar
 * 
 * Objetivos: Introducir Repetición
 * Enunciado: Repetir salto.
 */
 class NoMeCansoDeSaltar extends ElObreroCopado{
 	saltosRestantes;
 	iniciar() {
        this.fondo = new Fondo('fondos.obrero.png',0,0);
        this.obrero = new Obrero(160,-100);
        this.obrero.aprender(AvisaAlSalirDePantalla,{});
        this.saltosRestantes=30;
    }

    saltarHablando(){
        this.obrero.hacer_luego(SaltarHablando)
    }
    fraseAlSaltar(){
    	this.saltosRestantes--;
    	return this.saltosRestantes.toString();
    }
}
 