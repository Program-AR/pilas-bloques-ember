/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>

// No sólo avisa al salir de la pantalla, sino que no lo deja irse.
// Usar en reemplazo de la habilidad SeMantieneEnPantalla
// TODO: Repite código con SeMantieneEnPantalla, modificar pilas para que deje de hacerlo.

class EstallarAlSalirDePantalla extends HabilidadAnimada {

    constructor(receptor) {
        super(receptor);
        this.receptor.evto_se_movio.conectar(this);
    }

    recibir(evento, tipo) {
        if (tipo == this.receptor.evto_se_movio &&
            this.seSalioDeLaPantalla()) {
            throw new ActividadError("¡Me salgo de la pantalla!")
        }
    }

    seSalioDeLaPantalla() {
        return this.seFuePorDerecha() ||
            this.seFuePorIzquierda() ||
            this.seFuePorArriba() ||
            this.seFuePorAbajo();
    }

    seFuePorIzquierda() {
        return this.receptor.x < pilas.izquierda();
    }

    seFuePorDerecha() {
        return this.receptor.x > pilas.derecha();
    }

    seFuePorArriba() {
        return this.receptor.y > pilas.arriba();
    }

    seFuePorAbajo() {
        return this.receptor.y < pilas.abajo();
    }
}