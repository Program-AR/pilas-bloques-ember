/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "ComportamientoConEtiqueta.ts" />

class PrepararEnsalada extends InteractuarConEtiqueta {

    constructor() {

        super({
            etiqueta: "Ensaladera",
            nombreAnimacion: "prepararEnsalada",
            animacionColisionadoMientras: "preparando",
            animacionAlFinalizarInteraccion: "llena",
            idTransicion: "prepararEnsalada"
        })
    }

    configurarVerificaciones() {
        super.configurarVerificaciones()

        const escena = pilas.escena_actual()

        this.verificacionesPre.push(new Verificacion(() => !escena.hayDeLosDosIngredientes(),
            '¡Todavía me quedan ingredientes por recoger!'))

        this.verificacionesPre.push(new Verificacion(() => escena.noHayMasTomates(),
            '¡Todavía me queda tomate por recoger!'))

        this.verificacionesPre.push(new Verificacion(() => escena.noHayMasLechugas(),
            '¡Todavía me queda lechuga por recoger!'))

    }

    postAnimacion() {
        super.postAnimacion()
        if (pilas.escena_actual().noHayMasIngredientes()) {
            pilas.escena_actual().estado = new Estado(() =>
                true
            )
        }
    }

}