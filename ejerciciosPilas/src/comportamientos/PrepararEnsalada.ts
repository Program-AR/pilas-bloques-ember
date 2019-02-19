/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoColision.ts" />

class PrepararEnsalada extends ComportamientoColision {

    constructor() {

        super({
            etiqueta: "Ensaladera",
            nombreAnimacion: "prepararEnsalada",
            animacionColisionadoMientras: "preparando",
            animacionColisionadoPost: "llena",
            idTransicion: "prepararEnsalada"
        });
    }

    configurarVerificaciones() {
        super.configurarVerificaciones();

        const escena = pilas.escena_actual();

        this.verificacionesPre.push(new Verificacion(() => !escena.hayDeLosDosIngredientes(),
            '¡Todavía me quedan ingredientes por recoger!'))

        this.verificacionesPre.push(new Verificacion(() => escena.noHayMasTomates(),
            '¡Todavía me queda tomate por recoger!'));

        this.verificacionesPre.push(new Verificacion(() => escena.noHayMasLechugas(),
            '¡Todavía me queda lechuga por recoger!'));

    }

    postAnimacion() {
        super.postAnimacion();
        if (pilas.escena_actual().noHayMasIngredientes()) {
            pilas.escena_actual().estado = new Estado(() =>
                true
            );
        }
    }

}