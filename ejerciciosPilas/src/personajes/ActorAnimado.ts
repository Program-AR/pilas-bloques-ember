/// <reference path = "../../dependencias/pilasweb.d.ts" />


/**
 * @class ActorAnimado
 * 
 * Representa un actor que tiene una animación cuando se mueve.
 * Las opciones deben incluir la grilla (imagen) y la cantidad de cuadros que tiene,
 * ó bien la grilla y la lista de cuadros que representan la animación. También puede
 * incluir el cuadroEstatico, que es el cuadro que se muestra al estar parado.
 * 
 * Por ejemplo:
 *      @example
 *      miActor = new ActorAnimado(0,0,{grilla: 'miImagen.png', cuadrosCorrer: [3,4,5,6]});
 *      miActor.hacer_luego(CaminaDerecha,{pasos: 2});
 */
class ActorAnimado extends Actor {
    paso;
    opciones;
    constructor(x, y, opciones) {
        this.sanitizarOpciones(opciones);
        var imagen = pilas.imagenes.cargar_grilla(this.opciones.grilla, this.opciones.cantCuadrosCorrer);
        super(imagen, x, y);
        this._imagen.definir_cuadro(opciones.cuadroEstatico);
    }
  
    sanitizarOpciones(ops){
        this.opciones = ops;
        this.opciones.cuadrosCorrer = ops.cuadrosCorrer || this.seguidillaHasta(ops.cantCuadrosCorrer) || [0];
        this.opciones.cantCuadrosCorrer = ops.cantCuadrosCorrer || this.opciones.cuadrosCorrer.length;
        this.opciones.cuadroEstatico = ops.cuadroEstatico || 0;
    }
    
    mover(x,y) {
        this.x += x;
        this.y += y;
        this.animacion_correr();
    }

    animacion_correr() {
        this.paso += .3;
        if (this.paso>this.opciones.cantCuadrosCorrer) {
            this.paso = 0;
        }
        this._imagen.definir_cuadro(this.opciones.cuadrosCorrer[parseInt(this.paso)]);
    }
    detener_animacion() {
        this._imagen.definir_cuadro(this.opciones.cuadroEstatico);
    }
    
    seguidillaHasta(nro){
        var seguidilla = [];
        if(nro !== undefined) {
            for(var i = 0; i < nro; i++){
                seguidilla.push(i);
            }
        }
        return seguidilla;
    }
} 