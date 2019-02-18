/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoColision.ts" />

class PrepararEnsalada extends ComportamientoColision {

    constructor() {

        const argumentos = {
            etiqueta: "Ensaladera",
            nombreAnimacion: "prepararEnsalada",
            animacionColisionadoMientras: "preparando",
            animacionColisionadoPost: "llena",
            idTransicion: "prepararEnsalada"
        };

        super(argumentos);
    }

    configurarVerificaciones() {
        super.configurarVerificaciones();
        this.verificacionesPre.push(new Verificacion(() => pilas.escena_actual().noHayMasIngredientes(),
            "Necesito todos los ingredientes"
        ));
    }

}