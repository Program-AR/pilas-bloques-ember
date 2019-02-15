/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class PrepararEnsalada extends ComportamientoColision {

    configurarVerificaciones() {
        super.configurarVerificaciones();
        this.verificacionesPre.push(new Verificacion(() =>   pilas.escena_actual().noHayMasIngredientes(), 
        "Necesito todos los ingredientes"
        ));
	}

}